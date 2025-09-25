import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          date: string
          payment_method: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          date: string
          payment_method: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          date?: string
          payment_method?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category: string
          monthly_limit: number
          month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          monthly_limit: number
          month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          monthly_limit?: number
          month?: string
          created_at?: string
          updated_at?: string
        }
      }
      monthly_reports: {
        Row: {
          id: string
          user_id: string
          month: string
          total_spent: number
          top_category: string
          overbudget_categories: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          total_spent: number
          top_category: string
          overbudget_categories: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          total_spent?: number
          top_category?: string
          overbudget_categories?: string[]
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}