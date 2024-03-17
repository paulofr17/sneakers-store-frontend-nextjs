import { Locale } from '@/i18n-config'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import { ForgotPasswordDictionary } from '@/models/dictionary'
import { ForgotPasswordForm } from './forgotPasswordForm'

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const pageTitle =
    params.lang === 'en'
      ? 'Forgot Password'
      : params.lang === 'pt'
      ? 'Palavra-passe perdida'
      : 'Contraseña olvidada'
  return {
    title: pageTitle + ' | Sneakers Store',
  }
}

export default async function Page({ params }: { params: { lang: Locale } }) {
  const dictionary: ForgotPasswordDictionary = (await getDictionary(params.lang)).forgotPassword
  return <ForgotPasswordForm lang={params.lang} dictionary={dictionary} />
}
