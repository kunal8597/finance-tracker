import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useExpenses } from './hooks/useExpenses'
import { useBudgets } from './hooks/useBudgets'
import { AuthForm } from './components/AuthForm'
import { Navigation } from './components/Navigation'
import { Dashboard } from './components/Dashboard'
import { ExpenseManager } from './components/ExpenseManager'
import { BudgetManager } from './components/BudgetManager'
import { Reports } from './components/Reports'

export default function App() {
  const { user, loading: authLoading } = useAuth()
  const { expenses } = useExpenses(user?.id)
  const { budgets } = useBudgets(user?.id)
  const [activeTab, setActiveTab] = useState('dashboard')

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard expenses={expenses} budgets={budgets} />
      case 'expenses':
        return <ExpenseManager />
      case 'budgets':
        return <BudgetManager />
      case 'reports':
        return <Reports />
      default:
        return <Dashboard expenses={expenses} budgets={budgets} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderActiveTab()}
      </main>
    </div>
  )
}