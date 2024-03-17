'use client'

import { Locale } from '@/i18n-config'
import { ForgotPasswordDictionary } from '@/models/dictionary'
import { useState } from 'react'
import { Blinker } from '@/components/Loading'
import toast, { Toaster } from 'react-hot-toast'
import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface ForgotPasswordFormProps {
  lang: Locale
  dictionary: ForgotPasswordDictionary
}

export function ForgotPasswordForm({ lang, dictionary }: ForgotPasswordFormProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    // await swell.account.recover({
    //   email,
    //   reset_url: `${window.location.origin}/${lang}/account/reset-password?key={reset_key}`,
    // })
    setIsLoading(false)
    toast.success(dictionary.successToastMessage)
    router.push(`/${lang}/signin`)
  }

  if (status === 'authenticated') {
    redirect(`/${lang}`)
  }

  if (status === 'unauthenticated') {
    return (
      <div className="m-auto flex w-full flex-col items-center">
        <div className="flex min-h-full w-full flex-1 flex-col justify-center px-4">
          <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
            <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
              <p className="text-center text-xl font-semibold">{dictionary.title}</p>
              <p className="mb-4 text-center text-sm text-zinc-500">{dictionary.instructions}</p>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-1">
                  <Label className="px-[2px] py-1">{dictionary.email}</Label>
                  <Input
                    required
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 focus-visible:ring-offset-0"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  className="h-8 rounded-sm bg-red-500 text-xs font-semibold text-white hover:bg-red-500/70 focus-visible:ring-gray-500"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Blinker /> : dictionary.sendButton}
                </button>
                <Link
                  className="flex h-8 items-center justify-center rounded-sm border border-gray-400 text-xs font-semibold text-gray-800 hover:bg-gray-100"
                  type="submit"
                  href={`/${lang}/account/signin`}
                >
                  {dictionary.backButton}
                </Link>
              </form>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    )
  }
}
