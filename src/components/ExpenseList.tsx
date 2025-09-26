import React, { useState } from 'react'
import { Edit2, Trash2, Search, Filter } from 'lucide-react'
import type { Expense } from '../types'
import { formatDisplayDate, formatCurrency } from '../utils/dateHelpers'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../types'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export function ExpenseList({ expenses, onEdit, onDelete, loading = false }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || expense.category === categoryFilter
    const matchesPayment = !paymentFilter || expense.payment_method === paymentFilter
    
    return matchesSearch && matchesCategory && matchesPayment
  })

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))
  ]

  const paymentOptions = [
    { value: '', label: 'All Payment Methods' },
    ...PAYMENT_METHODS.map(method => ({ value: method, label: method }))
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading expenses...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 bg-[#1b1b1b]">
      {/* Filters */}
      <div className="bg-[#1b1b1b] p-4 rounded-lg space-y-4 lg:space-y-0 lg:flex lg:gap-4 lg:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className=" bg-[#1b1b1b] absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1b1b1b]"
            />
          </div>
        </div>
        <div className="lg:w-48 bg-[#1b1b1b]">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoryOptions}
            className='bg-[#1b1b1b]'
          />
        </div>
        <div className="lg:w-48 bg-[#1b1b1b]">
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            options={paymentOptions}
            className='bg-[#1b1b1b]'
          />
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {expenses.length === 0 ? 'No expenses yet.' : 'No expenses match your filters.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-[#1b1b1b] border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-lg text-gray-100">
                      {formatCurrency(expense.amount)}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {expense.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      {expense.payment_method}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div className="mb-1">{formatDisplayDate(expense.date)}</div>
                    {expense.notes && (
                      <div className="text-gray-500 italic">{expense.notes}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(expense)}
                    className='text-gray-200'
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}