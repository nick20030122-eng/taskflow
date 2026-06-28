export type StepStatus = "success" | "skipped" | "error";

export interface StepResult {
  stepName: string;
  status: StepStatus;
  durationMs: number;
  errorCode?: string;
  outputSummary: string;
}

export interface WorkflowStep {
  name: string;
  required: boolean;
  timeoutMs: number;
  run: (input: unknown) => Promise<{ output: unknown; summary: string }>;
}

export class WorkflowSkip extends Error {
  errorCode: string;
  constructor(errorCode: string) {
    super("WORKFLOW_SKIP");
    this.errorCode = errorCode;
  }
}

export async function runWorkflow(
  steps: WorkflowStep[],
  initialInput: unknown
): Promise<{ results: StepResult[]; finalOutput: unknown }> {
  const results: StepResult[] = [];
  let current: unknown = initialInput;

  for (const step of steps) {
    const start = Date.now();
    try {
      const res = await Promise.race([
        step.run(current),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(Object.assign(new Error("TIMEOUT"), { errorCode: "TIMEOUT" })),
            step.timeoutMs
          )
        ),
      ]);
      results.push({
        stepName: step.name,
        status: "success",
        durationMs: Date.now() - start,
        outputSummary: res.summary,
      });
      current = res.output;
    } catch (err) {
      const durationMs = Date.now() - start;
      if (err instanceof WorkflowSkip) {
        results.push({
          stepName: step.name,
          status: "skipped",
          durationMs,
          errorCode: err.errorCode,
          outputSummary: `건너뜀 (${err.errorCode})`,
        });
        continue;
      }
      const errorCode =
        err instanceof Error
          ? ((err as Error & { errorCode?: string }).errorCode ?? "STEP_ERROR")
          : "STEP_ERROR";
      results.push({
        stepName: step.name,
        status: "error",
        durationMs,
        errorCode,
        outputSummary: `오류 (${errorCode})`,
      });
      if (step.required) break;
    }
  }

  return { results, finalOutput: current };
}
