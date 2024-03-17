import { Locale } from '@/i18n-config'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import { ResetPasswordDictionary } from '@/models/dictionary'
import { ResetPasswordForm } from './resetPasswordForm'

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const pageTitle =
    params.lang === 'en'
      ? 'Reset Password'
      : params.lang === 'pt'
      ? 'Recuperar palavra-passe'
      : 'Restablecer contraseña'
  return {
    title: pageTitle + ' | Sneakers Store',
  }
}

export default async function Page({ params }: { params: { lang: Locale } }) {
  const dictionary: ResetPasswordDictionary = (await getDictionary(params.lang)).resetPassword
  return <ResetPasswordForm lang={params.lang} dictionary={dictionary} />
}
