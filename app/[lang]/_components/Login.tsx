'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LogOut, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Locale } from '@/i18n-config'
import { HomeDictionary } from '@/models/dictionary'

interface LoginProps {
  lang: Locale
  dictionary: HomeDictionary
}

export function Login({ lang, dictionary }: LoginProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  async function logout() {
    signOut()
  }

  if (status === 'authenticated') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          {session.user?.image ? (
            <Image
              src={session.user.image}
              className="rounded-full"
              width={28}
              height={28}
              alt=""
            />
          ) : (
            <User size={24} />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {session.user?.name ? session.user.name : 'My account'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link className="w-full" href={`/${lang}/account/orders`}>
              {dictionary.orders}
            </Link>
          </DropdownMenuItem>
          {pathname.startsWith(`/${lang}/admin`) && (
            <DropdownMenuItem>
              <Link className="w-full" href={`/${lang}`}>
                {dictionary.shop}
              </Link>
            </DropdownMenuItem>
          )}
          {session.user?.role === 'admin' && !pathname.startsWith(`/${lang}/admin`) && (
            <DropdownMenuItem>
              <Link className="w-full" href={`/${lang}/admin`}>
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{dictionary.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
