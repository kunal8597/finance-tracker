import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { EXPENSE_CATEGORIES } from '../types'
import type { BudgetFormData } from '../types'
import { getCurrentMonth } from '../utils/dateHelpers'

const budgetSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES as any),
  monthly_limit: z.number().positive('Budget must be positive'),
  month: z.string().min(1, 'Month is required'),
})

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<BudgetFormData>
  loading?: boolean
}

export function BudgetForm({ onSubmit, onCancel, initialData, loading = false }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: getCurrentMonth(),
      ...initialData,
    },
  })

  const categoryOptions = EXPENSE_CATEGORIES.map(category => ({
    value: category,
    label: category,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        {...register('category')}
        label="Category"
        options={categoryOptions}
        error={errors.category?.message}
      />

      <Input
        {...register('monthly_limit', { valueAsNumber: true })}
        label="Monthly Budget Limit (₹)"
        type="number"
        step="0.01"
        min="0"
        error={errors.monthly_limit?.message}
      />

      <Input
        {...register('month')}
        label="Month"
        type="month"
        error={errors.month?.message}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : initialData ? 'Update Budget' : 'Add Budget'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}