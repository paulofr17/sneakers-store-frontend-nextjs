import axios from '@/lib/axios'
import Link from 'next/link'
import Image from 'next/image'

import { Login } from '@/app/[lang]/_components/Login'
import CartSlider from '@/app/[lang]/_components/CartSlider'
import { Dictionary } from '@/models/dictionary'
import { LanguageSelect } from '@/components/layout/LanguageSelect'
import SideBar from '@/components/layout/Sidebar'
import logo from '@/assets/logo.png'
import { Locale } from '@/i18n-config'
import { auth } from '@/auth'
import { NavLinks } from './NavLinks'

interface NavBarProps {
  params: { lang: Locale }
  dictionary: Dictionary
}

export async function NavBar({ params, dictionary }: NavBarProps) {
  const session = await auth()
  const categories: string[] = await axios
    .get(`/api/categories`)
    .then((res) => res.data)
    .catch(() => [])

  return (
    <nav className="mx-auto mb-4 flex w-full max-w-[1920px] flex-col items-center gap-4 lg:mb-10">
      <div className="flex h-10 w-full items-center justify-between bg-zinc-700 px-3 text-xs font-medium text-white md:gap-1 lg:px-[100px] 2xl:text-sm">
        <div className="hidden shrink md:flex md:flex-1">
          <LanguageSelect lang={params.lang} />
        </div>
        <div className="flex w-full items-center justify-center gap-1 text-center md:w-auto lg:gap-2">
          {dictionary.home.headerText}
        </div>
        <div className="hidden shrink-0 justify-end gap-2 md:flex md:flex-1 2xl:gap-4">
          {!session && (
            <>
              <Link href={`/${params.lang}/account/signin`} className="hover:opacity-80">
                {dictionary.home.login}
              </Link>
              <span className="w-[1px] bg-gray-400"></span>
              <Link href={`/${params.lang}/account/signup`} className="hover:opacity-80">
                {dictionary.home.register}
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex w-full px-3 lg:px-[100px]">
        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
          <SideBar lang={params.lang} dictionary={dictionary.home} categories={categories} />
          {/* Logo */}
          <div className="flex md:flex-1">
            <Link href={`/${params.lang}`}>
              <Image src={logo.src} width={64} height={51} alt="Sneakers Store" />
            </Link>
            <div className="flex-1"></div>
          </div>
          {/* Nav Links */}
          <NavLinks lang={params.lang} dictionary={dictionary.home} categories={categories} />
          {/* Login and Cart buttons */}
          <div className="flex flex-1 items-center justify-end gap-x-4">
            <Login lang={params.lang} dictionary={dictionary.home} />
            <CartSlider lang={params.lang} dictionary={dictionary.cart} />
          </div>
        </div>
      </div>
    </nav>
  )
}
