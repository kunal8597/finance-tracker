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
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }

  const IconComponent = icons[type]

  return (
    <div className={`flex items-center gap-3 p-4 border rounded-lg ${styles[type]} ${className}`}>
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}