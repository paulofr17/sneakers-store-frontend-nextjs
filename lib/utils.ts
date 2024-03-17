import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = ({
  amount,
  local = 'pt-PT',
  currency = 'EUR',
  decimalPlaces = 2,
}: {
  amount: number
  local?: string
  currency?: string
  decimalPlaces?: number
}) => {
  const formatter = new Intl.NumberFormat(local, {
    style: 'currency',
    currency,
    maximumFractionDigits: decimalPlaces,
  })

  return isNaN(amount) ? '--' : formatter.format(amount)
}
