import { ReactNode } from 'react'
import { classNames } from '../../utils/helpers'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={classNames(
        'bg-white rounded-lg overflow-hidden border border-gray-200',
        hover && 'transition-all duration-300 hover:shadow-xl cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}