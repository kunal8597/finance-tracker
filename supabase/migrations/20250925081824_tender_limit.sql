/*
  # Create expenses table

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric, expense amount)
      - `category` (text, expense category)
      - `date` (date, expense date)
      - `payment_method` (text, payment method used)
      - `notes` (text, optional notes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `expenses` table
    - Add policy for users to manage their own expenses
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  category text NOT NULL,
  date date NOT NULL,
  payment_method text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS expenses_user_id_date_idx ON expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS expenses_user_id_category_idx ON expenses(user_id, category);