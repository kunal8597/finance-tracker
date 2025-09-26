import React from 'react'
import { BarChart3, PlusCircle, Settings, LogOut, DollarSign } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { signOut, user } = useAuth()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses', icon: PlusCircle },
    { id: 'budgets', label: 'Budgets', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: Settings },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="bg-[#1b1b1b] shadow-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white mr-8">ExpenseTracker</h1>
            <div className="hidden md:flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-400 bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden border-t border-white/10">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center px-2 py-2 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}