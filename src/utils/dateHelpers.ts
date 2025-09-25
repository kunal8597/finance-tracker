import { format, startOfMonth, endOfMonth, subDays, parseISO } from 'date-fns'

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}

export function formatDisplayDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM dd, yyyy')
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM')
}

export function getMonthName(monthString: string): string {
  const date = parseISO(monthString + '-01')
  return format(date, 'MMMM yyyy')
}

export function getMonthBounds(monthString: string) {
  const date = parseISO(monthString + '-01')
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function getLast30Days() {
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 30)
  return {
    start: thirtyDaysAgo,
    end: today,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}