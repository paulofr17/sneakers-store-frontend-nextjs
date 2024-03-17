'use client'

import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Locale } from '@/i18n-config'
import { HomeDictionary } from '@/models/dictionary'

interface HoverDropDownProps {
  lang: Locale
  dictionary: HomeDictionary
  categories: string[]
}

export function HoverDropdown({ lang, dictionary, categories }: HoverDropDownProps) {
  return (
    <NavigationMenu className="m-0 p-0">
      <NavigationMenuItem>
        <NavigationMenuTrigger className="m-0 p-0 text-lg font-medium text-gray-500 hover:bg-white data-[state=open]:bg-white">
          {dictionary.brands}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="z-0 flex w-[180px] flex-col gap-y-1 p-2 text-center">
            {categories.map((category) => (
              <Link key={category} href={`/${lang}/products?brand=` + category}>
                <li className="rounded-md p-1 text-base hover:bg-zinc-100">{category}</li>
              </Link>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  )
}
