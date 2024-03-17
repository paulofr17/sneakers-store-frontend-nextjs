import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import NextAuthSessionProvider from '@/providers/sessionProvider'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import { NavBar } from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/sonner'
import Footer from '@/components/layout/Footer'
import { Locale, i18n } from '@/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sneakers Store',
  description: 'Sneakers Store - The best sneakers store in the world',
}

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(params.lang)
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <div className="mx-auto flex min-h-screen max-w-[1920px] flex-col">
            <NavBar params={params} dictionary={dictionary} />
            {children}
            <Footer dictionary={dictionary.home} />
          </div>
        </NextAuthSessionProvider>
        <Toaster theme="light" position="top-center" duration={2000} closeButton richColors />
      </body>
    </html>
  )
}
