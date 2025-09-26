import React from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  className?: string
}

export function Alert({ type, message, className = '' }: AlertProps) {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  }

  const styles = {
    success: 'bg-green-900/30 text-green-200 border-green-700/40',
    warning: 'bg-yellow-900/30 text-yellow-200 border-yellow-700/40',
    error: 'bg-red-900/30 text-red-200 border-red-700/40',
    info: 'bg-blue-900/30 text-blue-200 border-blue-700/40',
  }

  const IconComponent = icons[type]

  return (
    <div className={`flex items-center gap-3 p-4 border rounded-lg ${styles[type]} ${className}`}>
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}