'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import * as z from 'zod'

import { loginSchema } from '@/lib/schemas/loginSchema'
import { revalidatePage } from '@/actions/actions'
import { SignInDictionary } from '@/models/dictionary'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Blinker } from '@/components/Loading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Locale } from '@/i18n-config'

type FormData = z.infer<typeof loginSchema>

interface SignInProps {
  lang: Locale
  dictionary: SignInDictionary
}

export default function SignIn({ lang, dictionary }: SignInProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(loginData: FormData) {
    setLoading(true)
    const { email, password } = loginData
    signIn('credentials', { email, password, redirect: false })
      .then((res) =>
        res?.ok
          ? toast.success(dictionary.titleSignin)
          : toast.error(dictionary.invalidCredentials),
      )
      .catch(() => toast.error('Something went wrong'))
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: _, status } = useSession()

  async function googleLogin() {
    signIn('google', { callbackUrl: `/${lang}` })
  }

  if (status === 'authenticated') {
    router.replace(`/${lang}`)
    revalidatePage(`/${lang}`)
  }

  if (status === 'unauthenticated') {
    return (
      <div className="m-auto flex w-full flex-col items-center">
        <div className="flex min-h-full w-full flex-1 flex-col justify-center px-4">
          <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
            <p className="text-xl font-semibold tracking-wide text-black">
              {dictionary.titleSignin}
            </p>
          </div>
          <div className="mx-auto mt-8 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Label htmlFor="email">{dictionary.email}</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="example@gmail.com"
                  className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 focus-visible:ring-offset-0"
                  {...register('email', { required: true })}
                />
                {errors?.email && <p className="text-sm text-red-600">{dictionary.invalidEmail}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">{dictionary.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 focus-visible:ring-offset-0"
                  {...register('password', { required: true })}
                />
                {errors?.password && (
                  <p className="text-sm text-red-600">{dictionary.invalidPassword}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-gray-400 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs font-medium leading-none text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {dictionary.rememberMe}
                  </label>
                </div>
                <Link
                  href={`/${lang}/account/forgot-password`}
                  className="text-xs font-semibold leading-none text-red-500"
                >
                  {dictionary.forgotPassword}
                </Link>
              </div>
              <Button
                className="h-8 bg-red-500 text-xs font-semibold text-white hover:bg-red-500/70"
                type="submit"
                disabled={!z.isDirty || !z.isValid || isSubmitting || loading}
              >
                {loading ? <Blinker /> : 'Login'}
              </Button>
            </form>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm font-normal">
                <span className="bg-white px-4">{dictionary.continueWith}</span>
              </div>
            </div>
            <div className="mt-6 flex w-full space-x-2">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-400 bg-white p-1 text-black hover:bg-zinc-100"
                onClick={() => googleLogin()}
              >
                <FcGoogle size={24}></FcGoogle>
                <span className="text-sm font-semibold">Google</span>
              </button>
              {/* <button
                className="flex w-full items-center justify-center gap-2 rounded-md bg-rose-500 p-1 text-white decoration-inherit hover:bg-rose-500/70"
                onClick={() => {
                  facebookLogin()
                }}
              >
                <InstagramIcon size={24}></InstagramIcon>
                <span className="text-sm font-semibold">Instagram</span>
              </button> */}
            </div>
          </div>
          <div className="mx-auto mt-8 text-sm">
            {dictionary.notAmember}
            <Link className="font-semibold text-red-500" href={`/${lang}/account/signup`}>
              {dictionary.createAccount}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
