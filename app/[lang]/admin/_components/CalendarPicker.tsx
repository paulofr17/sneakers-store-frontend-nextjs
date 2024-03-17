'use client'

import { useCallback, useState } from 'react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { CalendarIcon } from '@radix-ui/react-icons'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function CalendarPicker() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startDate = searchParams.get('startDate')
    ? new Date(searchParams.get('startDate') as string)
    : new Date(2024, 0, 1)
  const endDate = searchParams.get('endDate')
    ? new Date(searchParams.get('endDate') as string)
    : new Date(2024, 11, 31)
  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  })
  const createQueryString = useCallback(
    (newParams: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams)
      newParams.forEach(({ name, value }) => params.set(name, value))
      return params.toString()
    },
    [searchParams],
  )

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(selected) => {
              setDate(selected)
              router.push(
                pathname +
                  '?' +
                  createQueryString([
                    { name: 'startDate', value: selected?.from?.toISOString().slice(0, 10) || '' },
                    { name: 'endDate', value: selected?.to?.toISOString().slice(0, 10) || '' },
                  ]),
              )
            }}
            numberOfMonths={2}
            fromDate={new Date(2024, 0, 1)}
            toDate={new Date(2024, 11, 31)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
