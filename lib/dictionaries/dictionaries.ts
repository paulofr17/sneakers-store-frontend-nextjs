import 'server-only'
import type { Locale } from '@/i18n-config'

const dictionaries = {
  en: () => import('@/lib/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/lib/dictionaries/es.json').then((module) => module.default),
  pt: () => import('@/lib/dictionaries/pt.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
