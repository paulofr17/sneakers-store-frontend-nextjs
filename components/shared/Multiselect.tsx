'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'

type Option = {
  label: string
  value: string
}

interface MultiselectProps {
  options: Option[]
  selected: Option[]
  setSelected: React.Dispatch<React.SetStateAction<Option[]>>
}

export function Multiselect({ options, selected, setSelected }: MultiselectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = React.useCallback((option: Option) => {
    setSelected((prev) => prev.filter((s) => s.value !== option.value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          setSelected((prev) => {
            const newSelected = [...prev]
            newSelected.pop()
            return newSelected
          })
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectables = options.filter(
    (option) => !selected.some((selectedOption) => selectedOption.value === option.value),
  )

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select options..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {open && selectables.length > 0 ? (
        <div className="relative">
          <div className="animate-in absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue('')
                      setSelected((prev) => [...prev, option])
                    }}
                    className={'cursor-pointer'}
                  >
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        </div>
      ) : null}
    </Command>
  )
}
