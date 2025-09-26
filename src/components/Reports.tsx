import React, { useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Card, CardHeader, CardContent } from './ui/Card'
import { formatCurrency, getCurrentMonth, getMonthName } from '../utils/dateHelpers'
import { useExpenses } from '../hooks/useExpenses'
import { useBudgets } from '../hooks/useBudgets'
import { analyzeExpenses, generateSpendingSuggestions } from '../utils/expenseAnalysis'

export function Reports() {
  const { user } = useAuth()
  const currentMonth = getCurrentMonth()
  const { expenses, loading: expensesLoading } = useExpenses(user?.id)
  const { budgets, loading: budgetsLoading } = useBudgets(user?.id)

  const analysis = useMemo(() => analyzeExpenses(expenses, budgets), [expenses, budgets])
  const suggestions = useMemo(() => generateSpendingSuggestions(analysis), [analysis])

  const loading = expensesLoading || budgetsLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading report...</div>
      </div>
    )
  }

  const overBudgetCategories = analysis.budgetAlerts
    .filter(alert => alert.level === 'danger')
    .map(alert => alert.category)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-200">Monthly Report</h2>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-200">
            {getMonthName(currentMonth)}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-200">
                {formatCurrency(analysis.totalSpent)}
              </div>
                  <p className="text-sm text-gray-400">Total Spent</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-200">
                {analysis.topCategory}
              </div>
              <p className="text-sm text-gray-400">Top Category</p>
            </div>
            
            <div>
                <div className="text-2xl font-bold text-gray-200">
                {overBudgetCategories.length}
              </div>
              <p className="text-sm text-gray-400">Over Budget Categories</p>
            </div>
          </div>

          {overBudgetCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-200 mb-2">Over Budget Categories:</p>
              <div className="flex flex-wrap gap-2">
                {overBudgetCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-200 mb-2">Suggestions:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}