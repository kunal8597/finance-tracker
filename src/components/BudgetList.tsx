import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import type { Budget } from '../types'
import { formatCurrency, getMonthName } from '../utils/dateHelpers'
import { Button } from './ui/Button'

interface BudgetListProps {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export function BudgetList({ budgets, onEdit, onDelete, loading = false }: BudgetListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading budgets...</div>
      </div>
    )
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No budgets set yet. Create your first budget to track your spending limits.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget) => (
        <div
          key={budget.id}
          className="bg-[#1b1b1b] border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-lg text-gray-100">
                  {formatCurrency(budget.monthly_limit)}
                </span>
                <span className="px-2 py-1  bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {budget.category}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                <div>{getMonthName(budget.month)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(budget)}
                className='text-gray-200'
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(budget.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}