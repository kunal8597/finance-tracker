import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Expense, Budget } from '../types'
import { formatCurrency } from '../utils/dateHelpers'
import { analyzeExpenses, generateSpendingSuggestions } from '../utils/expenseAnalysis'
import { Card, CardHeader, CardContent } from './ui/Card'
import { Alert } from './ui/Alert'

interface DashboardProps {
  expenses: Expense[]
  budgets: Budget[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16']

export function Dashboard({ expenses, budgets }: DashboardProps) {
  const analysis = useMemo(() => analyzeExpenses(expenses, budgets), [expenses, budgets])
  const suggestions = useMemo(() => generateSpendingSuggestions(analysis), [analysis])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(analysis.totalSpent)}
            </div>
            <p className="text-sm text-gray-600">Total Spent This Month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">
              {analysis.topCategory}
            </div>
            <p className="text-sm text-gray-600">Top Spending Category</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">
              {analysis.topPaymentMethods[0]?.method || 'None'}
            </div>
            <p className="text-sm text-gray-600">Most Used Payment Method</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">
              {analysis.budgetAlerts.length}
            </div>
            <p className="text-sm text-gray-600">Budget Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {analysis.budgetAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Budget Alerts</h3>
          {analysis.budgetAlerts.map((alert, index) => (
            <Alert
              key={index}
              type={alert.level === 'danger' ? 'error' : 'warning'}
              message={`${alert.category}: ${formatCurrency(alert.spent)} of ${formatCurrency(alert.budget)} (${alert.percentage.toFixed(1)}%)`}
            />
          ))}
        </div>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Alert key={index} type="info" message={suggestion} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
          </CardHeader>
          <CardContent>
            {analysis.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analysis.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {analysis.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No expense data to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending Trend Line Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Daily Spending (Last 30 Days)</h3>
          </CardHeader>
          <CardContent>
            {analysis.dailySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analysis.dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No spending data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Payment Methods */}
      {analysis.topPaymentMethods.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Top Payment Methods</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.topPaymentMethods.map((method, index) => (
                <div key={method.method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{method.method}</div>
                      <div className="text-sm text-gray-500">{method.count} transactions</div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(method.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}