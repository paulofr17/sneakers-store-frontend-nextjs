import { redirect } from 'next/navigation'

import { Locale } from '@/i18n-config'
import { auth } from '@/auth'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const session = await auth()

  if (!session) {
    redirect(`/${params.lang}/account/signin`)
  }

  if (session?.user.role !== 'admin') {
    redirect(`/${params.lang}`)
  }

  return <div className="flex w-full flex-col px-3 lg:px-[100px]">{children}</div>
}
