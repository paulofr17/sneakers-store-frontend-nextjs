import { Plus } from 'lucide-react'
import Link from 'next/link'

import { ProductsTable } from '@/app/[lang]/admin/products/_components/ProductsTable'
import { Button } from '@/components/ui/button'
import { Product } from '@/models/types'
import { Locale } from '@/i18n-config'
import axios from '@/lib/axios'
import { ManageStock } from './_components/ManageStock'

export default async function ProductsPage({ params }: { params: { lang: Locale } }) {
  const products: Product[] = await axios.get(`/api/products`).then((res) => res.data)
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products ({products.length})</h2>
          <p className="text-sm text-muted-foreground">Manage Sneakers Store products</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Link href={`/${params.lang}/admin/products/new`} className="flex w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </Button>
          <ManageStock products={products} />
        </div>
      </div>
      <ProductsTable products={products} lang={params.lang} />
    </div>
  )
}
