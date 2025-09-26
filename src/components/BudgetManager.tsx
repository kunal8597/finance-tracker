import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useBudgets } from '../hooks/useBudgets'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { BudgetForm } from './BudgetForm'
import { BudgetList } from './BudgetList'
import type { Budget, BudgetFormData } from '../types'

export function BudgetManager() {
  const { user } = useAuth()
  const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudgets(user?.id)
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAddBudget = async (data: BudgetFormData) => {
    setSubmitting(true)
    try {
      const result = await addBudget(data)
      if (!result.error) {
        setShowModal(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditBudget = async (data: BudgetFormData) => {
    if (!editingBudget) return
    
    setSubmitting(true)
    try {
      const result = await updateBudget(editingBudget.id, data)
      if (!result.error) {
        setEditingBudget(null)
        setShowModal(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id)
    }
  }

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBudget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-200">Manage Budgets</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <BudgetList
        budgets={budgets}
        onEdit={openEditModal}
        onDelete={handleDeleteBudget}
        loading={loading}
      
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingBudget ? 'Edit Budget' : 'Add New Budget'}
      >
        <BudgetForm
          onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
          onCancel={closeModal}
          initialData={editingBudget ? {
            category: editingBudget.category,
            monthly_limit: editingBudget.monthly_limit,
            month: editingBudget.month,
          } : undefined}
          loading={submitting}
        />
      </Modal>
    </div>
  )
}