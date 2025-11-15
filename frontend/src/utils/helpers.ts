import { format, formatDistance } from 'date-fns'

export const formatDate = (date: string | Date, formatStr: string = 'PPP') => {
  return format(new Date(date), formatStr)
}

export const formatRelativeDate = (date: string | Date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const getImageUrl = (path?: string) => {
  if (!path) return '/placeholder-event.jpg'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL}${path}`
}

export const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}