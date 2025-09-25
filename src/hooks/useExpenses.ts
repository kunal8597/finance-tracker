import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Expense, ExpenseFormData } from '../types'

export function useExpenses(userId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [userId])

  const addExpense = async (expenseData: ExpenseFormData) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseData,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      if (data) {
        setExpenses(prev => [data[0], ...prev])
      }
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { data: null, error: errorMessage }
    }
  }

  const updateExpense = async (id: string, expenseData: Partial<ExpenseFormData>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          ...expenseData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setExpenses(prev => prev.map(expense => 
          expense.id === id ? data[0] : expense
        ))
      }
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { data: null, error: errorMessage }
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setExpenses(prev => prev.filter(expense => expense.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { error: errorMessage }
    }
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  }
}