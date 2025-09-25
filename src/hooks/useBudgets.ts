import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Budget, BudgetFormData } from '../types'

export function useBudgets(userId: string | undefined) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('month', { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [userId])

  const addBudget = async (budgetData: BudgetFormData) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          ...budgetData,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      if (data) {
        setBudgets(prev => [data[0], ...prev])
      }
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { data: null, error: errorMessage }
    }
  }

  const updateBudget = async (id: string, budgetData: Partial<BudgetFormData>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          ...budgetData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setBudgets(prev => prev.map(budget => 
          budget.id === id ? data[0] : budget
        ))
      }
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { data: null, error: errorMessage }
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setBudgets(prev => prev.filter(budget => budget.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { error: errorMessage }
    }
  }

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  }
}