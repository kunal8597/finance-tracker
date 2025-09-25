import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Card, CardHeader, CardContent } from './ui/Card'
import { formatCurrency, getMonthName } from '../utils/dateHelpers'
import type { MonthlyReport } from '../types'

export function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<MonthlyReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [user?.id])

  const fetchReports = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('month', { ascending: false })
        .limit(6)

      if (error) throw error
      setReports(data || [])
    } catch (err) {
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Monthly Reports</h2>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No monthly reports available yet. Reports are generated automatically at the end of each month.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getMonthName(report.month)}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(report.total_spent)}
                    </div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {report.top_category}
                    </div>
                    <p className="text-sm text-gray-600">Top Category</p>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {report.overbudget_categories.length}
                    </div>
                    <p className="text-sm text-gray-600">Over Budget Categories</p>
                  </div>
                </div>
                
                {report.overbudget_categories.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Over Budget Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.overbudget_categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}