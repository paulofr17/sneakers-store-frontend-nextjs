'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Locale } from '@/i18n-config'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LanguageSelectProps {
  lang: Locale
}

export function LanguageSelect({ lang }: LanguageSelectProps) {
  const router = useRouter()
  const [language, setLanguage] = useState(lang)

  return (
    <Select
      value={language}
      onValueChange={(value: Locale) => {
        setLanguage(value)
        router.push(`/${value}`)
      }}
    >
      <SelectTrigger className="h-8 w-16 border-0 bg-zinc-700 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="pt" title="PT">
            PT
          </SelectItem>
          <SelectItem value="es" title="ES">
            ES
          </SelectItem>
          <SelectItem value="en" title="EN">
            EN
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
