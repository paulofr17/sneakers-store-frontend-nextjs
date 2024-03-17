'use client'

import { Locale } from '@/i18n-config'
import { ResetPasswordDictionary } from '@/models/dictionary'
import { useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Blinker } from '@/components/Loading'
//import swell from '@/lib/swellFront/client'
import toast, { Toaster } from 'react-hot-toast'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ForgotPasswordFormProps {
  lang: Locale
  dictionary: ResetPasswordDictionary
}

export function ResetPasswordForm({ lang, dictionary }: ForgotPasswordFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const key = searchParams?.get('key')
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  type Inputs = {
    password: string
    confirmPassword: string
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsSubmitting(true)
      // await swell.account.recover({
      //   password: data.password,
      //   reset_key: key,
      // })
      setIsSubmitting(false)
      toast.success(dictionary.successToastMessage)
      router.push(`/${lang}/account/signin`)
    } catch (error) {
      setIsSubmitting(false)
      toast.error(dictionary.errorToastMessage)
    }
  }

  const password = useRef({})
  password.current = watch('password')

  if (status === 'authenticated') {
    redirect(`/${lang}`)
  }

  if (status === 'unauthenticated') {
    return (
      <div className="m-auto flex w-full flex-col items-center">
        <div className="flex min-h-full w-full flex-1 flex-col justify-center px-4">
          <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
            <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
              <p className="text-center text-xl font-semibold">{dictionary.title}</p>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  handleSubmit(onSubmit)(e)
                }}
              >
                <div className="flex flex-col space-y-1">
                  <Label className="px-[2px] py-1">{dictionary.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={dictionary.passwordPlaceholder}
                    className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 focus-visible:ring-offset-0"
                    {...register('password', {
                      required: dictionary.requiredPassword,
                      minLength: {
                        value: 8,
                        message: dictionary.invalidPassword,
                      },
                    })}
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  {errors.password && (
                    <p className="mb-4 ml-1 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <Label className="px-[2px] py-1">{dictionary.passwordConfirmation}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={dictionary.passwordConfirmationPlaceholder}
                    className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 focus-visible:ring-offset-0"
                    {...(password.current !== undefined && {
                      ...register('confirmPassword', {
                        validate: (value) =>
                          value === password.current || dictionary.invalidPasswordConfirmation,
                      }),
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mb-4 ml-1 mt-2 text-xs text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  className="mt-2 h-8 rounded-sm bg-red-500 text-xs font-semibold text-white hover:bg-red-500/70 focus-visible:ring-gray-500"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Blinker /> : dictionary.resetButton}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    )
  }
}
