'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Link from 'next/link'
import * as z from 'zod'

import { registerSchema } from '@/lib/schemas/registerSchema'
import { SignUpDictionary } from '@/models/dictionary'
import { revalidatePage } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Blinker } from '@/components/Loading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Locale } from '@/i18n-config'
import axios from '@/lib/axios'
import { toast } from 'sonner'

type FormData = z.infer<typeof registerSchema>

interface SignUpProps {
  lang: Locale
  dictionary: SignUpDictionary
}

export default function SignUp({ lang, dictionary }: SignUpProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: _, status } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(registerData: FormData) {
    setLoading(true)
    const user = {
      name: `${registerData.firstName} ${registerData.lastName}`,
      email: registerData.email,
      password: registerData.password,
    }
    await axios
      .post(`/api/users/register`, user)
      .then(() =>
        signIn('credentials', { email: user.email, password: user.password, redirect: false }),
      )
      .catch((err) => toast.error(err.response.data.message))
      .finally(() => setLoading(false))
  }

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
              {dictionary.titleSignup}
            </p>
          </div>
          <div className="mx-auto mt-4 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Label htmlFor="name">{dictionary.firstName}</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={dictionary.firstNamePlaceholder}
                  className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 focus-visible:ring-offset-0"
                  {...register('firstName', { required: true })}
                />
                {errors?.firstName?.type === 'too_small' && (
                  <p className="text-sm text-red-600">{dictionary.shortFieldError}</p>
                )}
                {errors?.firstName?.type === 'too_big' && (
                  <p className="text-sm text-red-600">{dictionary.longFieldError}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">{dictionary.lastName}</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={dictionary.lastNamePlaceholder}
                  className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 focus-visible:ring-offset-0"
                  {...register('lastName', { required: true })}
                />
                {errors?.lastName?.type === 'too_small' && (
                  <p className="text-sm text-red-600">{dictionary.shortFieldError}</p>
                )}
                {errors?.lastName?.type === 'too_big' && (
                  <p className="text-sm text-red-600">{dictionary.longFieldError}</p>
                )}
              </div>
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
              <Button
                className="mt-2 h-8 bg-red-500 text-xs font-semibold text-white hover:bg-red-500/70"
                type="submit"
                disabled={!z.z.isDirty || !z.isValid || isSubmitting || loading}
              >
                {loading ? <Blinker /> : dictionary.signupButton}
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
                  signIn('github', { email: '', password: '', callbackUrl: '/' })
                }}
              >
                <InstagramIcon size={24}></InstagramIcon>
                <span className="text-sm font-semibold">Instagram</span>
              </button> */}
            </div>
          </div>
          <div className="mx-auto mt-4 text-sm">
            {dictionary.alreadyHaveAccount}
            <Link className="font-semibold text-red-500" href={`/${lang}/account/signin`}>
              {dictionary.loginHere}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
