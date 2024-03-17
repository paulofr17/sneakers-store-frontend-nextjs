import { Locale } from '@/i18n-config'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import SignIn from './signin'
import { Dictionary } from '@/models/dictionary'

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const pageTitle =
    params.lang === 'en' ? 'Sign in' : params.lang === 'pt' ? 'Iniciar Sessão' : 'Iniciar Sesión'
  return {
    title: pageTitle + ' | Sneakers Store',
  }
}

export default async function Page({ params }: { params: { lang: Locale } }) {
  const dictionary: Dictionary = await getDictionary(params.lang)
  return <SignIn lang={params.lang} dictionary={dictionary.signIn} />
}
