-- Day 17: 관측성 인덱스 추가
-- activity_logs 조회 패턴 4종 최적화

CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type
  ON public.activity_logs (event_type);

CREATE INDEX IF NOT EXISTS idx_activity_logs_event_created
  ON public.activity_logs (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created
  ON public.activity_logs (user_id, created_at DESC);
