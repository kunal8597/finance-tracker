import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../types'
import type { ExpenseFormData } from '../types'
import { formatDate } from '../utils/dateHelpers'

const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.enum(EXPENSE_CATEGORIES as any),
  date: z.string().min(1, 'Date is required'),
  payment_method: z.enum(PAYMENT_METHODS as any),
  notes: z.string().optional(),
})

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<ExpenseFormData>
  loading?: boolean
}

export function ExpenseForm({ onSubmit, onCancel, initialData, loading = false }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: formatDate(new Date()),
      ...initialData,
    },
  })

  const categoryOptions = EXPENSE_CATEGORIES.map(category => ({
    value: category,
    label: category,
  }))

  const paymentMethodOptions = PAYMENT_METHODS.map(method => ({
    value: method,
    label: method,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-[#1b1b1b]">
      <Input
        {...register('amount', { valueAsNumber: true })}
        label="Amount (₹)"
        type="number"
        step="0.01"
        min="0"
        error={errors.amount?.message}
        className='bg-[#1b1b1b] text-gray-100'

      />

      <Select
        {...register('category')}
        label="Category"
        options={categoryOptions}
        error={errors.category?.message}
        className='bg-[#1b1b1b] text-gray-100'
      />

      <Input
        {...register('date')}
        label="Date"
        type="date"
        error={errors.date?.message}
        className='bg-[#1b1b1b] text-gray-100'
      />

      <Select
        {...register('payment_method')}
        label="Payment Method "
        options={paymentMethodOptions}
        error={errors.payment_method?.message}
        className='bg-[#1b1b1b] text-gray-100'
      />

      <Input
        {...register('notes')}
        label="Notes (Optional)"
        type="text"
        placeholder="Add any additional notes..."
        className='bg-[#1b1b1b] text-gray-100'
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1 text-gray-100">
          {loading ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 text-gray-100">
          Cancel
        </Button>
      </div>
    </form>
  )
}