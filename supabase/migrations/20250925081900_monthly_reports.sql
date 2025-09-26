/* monthly_reports table and RLS */
CREATE TABLE IF NOT EXISTS monthly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month text NOT NULL,
  total_spent numeric(12,2) NOT NULL DEFAULT 0,
  top_category text NOT NULL DEFAULT '',
  overbudget_categories text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users read own monthly reports"
  ON monthly_reports FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users write own monthly reports"
  ON monthly_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS monthly_reports_user_id_month_idx
  ON monthly_reports(user_id, month DESC);
