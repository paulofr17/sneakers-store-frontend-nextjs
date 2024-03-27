'use client'

import { HoverDropdown } from '@/app/[lang]/_components/HoverDropdown'
import { Locale } from '@/i18n-config'
import { HomeDictionary } from '@/models/dictionary'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinksProps {
  lang: Locale
  dictionary: HomeDictionary
  categories: string[]
}

const linkClasses = (pathname: string, link: string) => {
  if (pathname === link) {
    return 'text-black transition'
  }
  return 'transition hover:text-black'
}

export function NavLinks({ lang, dictionary, categories }: NavLinksProps) {
  const pathname = usePathname()
  return (
    <ul className="hidden items-center gap-6 text-lg font-medium text-gray-500 md:flex xl:gap-10 2xl:gap-12">
      {pathname.startsWith(`/${lang}/admin`) ? (
        <>
          <li className={linkClasses(pathname, `/${lang}/admin`)}>
            <Link href={`/${lang}/admin`}>Overview</Link>
          </li>
          <li className={linkClasses(pathname, `/${lang}/admin/products`)}>
            <Link href={`/${lang}/admin/products`}>Products</Link>
          </li>
        </>
      ) : (
        <>
          <li className={linkClasses(pathname, `/${lang}`)}>
            <Link href={`/${lang}`}>{dictionary.homepage}</Link>
          </li>
          <li className={linkClasses(pathname, `/${lang}/products`)}>
            <Link href={`/${lang}/products`}>{dictionary.shop}</Link>
          </li>
          <li className="transition hover:text-black">
            <HoverDropdown lang={lang} dictionary={dictionary} categories={categories} />
          </li>
          <li className={linkClasses(pathname, `/${lang}/faq`)}>
            <Link href={`/${lang}/faq`}>{dictionary.faq}</Link>
          </li>
        </>
      )}
    </ul>
  )
}
