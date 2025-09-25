import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useExpenses } from '../hooks/useExpenses'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseList } from './ExpenseList'
import type { Expense, ExpenseFormData } from '../types'

export function ExpenseManager() {
  const { user } = useAuth()
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(user?.id)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAddExpense = async (data: ExpenseFormData) => {
    setSubmitting(true)
    try {
      const result = await addExpense(data)
      if (!result.error) {
        setShowModal(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return
    
    setSubmitting(true)
    try {
      const result = await updateExpense(editingExpense.id, data)
      if (!result.error) {
        setEditingExpense(null)
        setShowModal(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id)
    }
  }

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingExpense(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Expenses</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <ExpenseList
        expenses={expenses}
        onEdit={openEditModal}
        onDelete={handleDeleteExpense}
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onCancel={closeModal}
          initialData={editingExpense ? {
            amount: editingExpense.amount,
            category: editingExpense.category,
            date: editingExpense.date,
            payment_method: editingExpense.payment_method,
            notes: editingExpense.notes || '',
          } : undefined}
          loading={submitting}
        />
      </Modal>
    </div>
  )
}