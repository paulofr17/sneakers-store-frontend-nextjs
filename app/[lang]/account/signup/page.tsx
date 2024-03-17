import { Locale } from '@/i18n-config'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import SignUp from './signup'
import { Dictionary } from '@/models/dictionary'

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const pageTitle =
    params.lang === 'en'
      ? 'Create your account'
      : params.lang === 'pt'
      ? 'Crie a sua conta'
      : 'Crear su cuenta'
  return {
    title: pageTitle + ' | Sneakers Store',
  }
}

export default async function Page({ params }: { params: { lang: Locale } }) {
  const dictionary: Dictionary = await getDictionary(params.lang)
  return <SignUp lang={params.lang} dictionary={dictionary.signUp} />
}
