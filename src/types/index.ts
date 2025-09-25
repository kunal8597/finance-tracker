export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  date: string
  payment_method: string
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  monthly_limit: number
  month: string
  created_at: string
  updated_at: string
}

export interface MonthlyReport {
  id: string
  user_id: string
  month: string
  total_spent: number
  top_category: string
  overbudget_categories: string[]
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface ExpenseFormData {
  amount: number
  category: string
  date: string
  payment_method: string
  notes?: string
}

export interface BudgetFormData {
  category: string
  monthly_limit: number
  month: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Rent',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Utilities',
  'Other'
] as const

export const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Net Banking',
  'Other'
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type PaymentMethod = typeof PAYMENT_METHODS[number]