import type { Expense, Budget } from '../types'
import { format, isWithinInterval, parseISO } from 'date-fns'
import { getCurrentMonth, getLast30Days, getMonthBounds } from './dateHelpers'

export interface ExpenseAnalysis {
  totalSpent: number
  topCategory: string
  topPaymentMethods: Array<{ method: string; amount: number; count: number }>
  categoryBreakdown: Array<{ category: string; amount: number; percentage: number }>
  dailySpending: Array<{ date: string; amount: number }>
  budgetAlerts: Array<{ category: string; spent: number; budget: number; percentage: number; level: 'warning' | 'danger' }>
}

export function analyzeExpenses(expenses: Expense[], budgets: Budget[]): ExpenseAnalysis {
  const currentMonth = getCurrentMonth()
  const { start: monthStart, end: monthEnd } = getMonthBounds(currentMonth)
  
  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(expense => 
    isWithinInterval(parseISO(expense.date), { start: monthStart, end: monthEnd })
  )

  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Category analysis
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'No expenses'

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  // Payment method analysis
  const paymentTotals = currentMonthExpenses.reduce((acc, expense) => {
    const method = expense.payment_method
    if (!acc[method]) {
      acc[method] = { amount: 0, count: 0 }
    }
    acc[method].amount += expense.amount
    acc[method].count += 1
    return acc
  }, {} as Record<string, { amount: number; count: number }>)

  const topPaymentMethods = Object.entries(paymentTotals)
    .map(([method, data]) => ({ method, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)

  // Daily spending for last 30 days
  const { start: last30Start, end: last30End } = getLast30Days()
  const last30DaysExpenses = expenses.filter(expense =>
    isWithinInterval(parseISO(expense.date), { start: last30Start, end: last30End })
  )

  const dailyTotals = last30DaysExpenses.reduce((acc, expense) => {
    const date = format(parseISO(expense.date), 'yyyy-MM-dd')
    acc[date] = (acc[date] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const dailySpending = Object.entries(dailyTotals)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Budget alerts
  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth)
  const budgetAlerts = currentMonthBudgets
    .map(budget => {
      const spent = categoryTotals[budget.category] || 0
      const percentage = budget.monthly_limit > 0 ? (spent / budget.monthly_limit) * 100 : 0
      
      if (percentage >= 100) {
        return { 
          category: budget.category, 
          spent, 
          budget: budget.monthly_limit, 
          percentage, 
          level: 'danger' as const 
        }
      } else if (percentage >= 80) {
        return { 
          category: budget.category, 
          spent, 
          budget: budget.monthly_limit, 
          percentage, 
          level: 'warning' as const 
        }
      }
      return null
    })
    .filter(Boolean) as Array<{ category: string; spent: number; budget: number; percentage: number; level: 'warning' | 'danger' }>

  return {
    totalSpent,
    topCategory,
    topPaymentMethods,
    categoryBreakdown,
    dailySpending,
    budgetAlerts,
  }
}

export function generateSpendingSuggestions(analysis: ExpenseAnalysis): string[] {
  const suggestions: string[] = []
  
  // High spending category suggestions
  if (analysis.categoryBreakdown.length > 0) {
    const topCategory = analysis.categoryBreakdown[0]
    if (topCategory.percentage > 40) {
      suggestions.push(`You're spending a lot on ${topCategory.category} (${topCategory.percentage.toFixed(1)}% of total). Consider reducing by 15%.`)
    }
  }

  // Budget alert suggestions
  analysis.budgetAlerts.forEach(alert => {
    if (alert.level === 'danger') {
      suggestions.push(`You've exceeded your ${alert.category} budget by ₹${(alert.spent - alert.budget).toFixed(0)}. Consider reviewing your ${alert.category.toLowerCase()} expenses.`)
    } else {
      suggestions.push(`You're close to your ${alert.category} budget limit (${alert.percentage.toFixed(1)}%). Try to limit further spending in this category.`)
    }
  })

  // Daily spending pattern suggestions
  if (analysis.dailySpending.length > 0) {
    const avgDaily = analysis.totalSpent / 30
    const recentAvg = analysis.dailySpending.slice(-7).reduce((sum, day) => sum + day.amount, 0) / 7
    
    if (recentAvg > avgDaily * 1.3) {
      suggestions.push(`Your spending has increased recently. Try to reduce daily expenses by ₹${(recentAvg - avgDaily).toFixed(0)}.`)
    }
  }

  // General suggestions
  if (suggestions.length === 0) {
    suggestions.push('Great job managing your expenses! Consider setting budgets for your top spending categories.')
  }

  return suggestions
}
