'use client'

import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

interface AdminBreadcrumbProps {
  lang: string
}

export function AdminBreadcrumb({ lang }: AdminBreadcrumbProps) {
  const pathname = usePathname()
  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: `/${lang}/admin` },
    { label: 'Products', href: `/${lang}/admin/products` },
  ]
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.flatMap((item, index) => [
          index > 0 && <BreadcrumbSeparator key={`separator-${index}`} />,
          <BreadcrumbItem key={index}>
            {item.href === pathname ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            )}
          </BreadcrumbItem>,
        ])}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
