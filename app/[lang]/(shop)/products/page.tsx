import { Suspense } from 'react'

import ProductSkeleton from '@/app/[lang]/(shop)/products/_components/productSkeleton'
import Filters from '@/app/[lang]/(shop)/products/_components/filters'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import Product from '@/app/[lang]/(shop)/products/_components/product'
import { Product as ProductType } from '@/models/types'
import { Dictionary } from '@/models/dictionary'
import { Locale } from '@/i18n-config'
import Await from '@/components/Await'
import axios from '@/lib/axios'

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const pageTitle = params.lang === 'en' ? 'Shop' : params.lang === 'pt' ? 'Loja' : 'Tienda'
  return {
    title: pageTitle + ' | Sneakers Store',
  }
}

export default async function Products({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
  params: { lang: Locale }
}) {
  searchParams.category = searchParams.brand
  const dictionary: Dictionary = await getDictionary(params.lang)
  const categories: string[] = await axios.get(`/api/categories`).then((res) => res.data || [])

  const products: Promise<ProductType[]> = axios
    .get(`/api/products`, {
      params: searchParams,
    })
    .then(async (res) => res.data || [])

  return (
    <div className="flex flex-col gap-6 px-3 sm:flex-row">
      <Filters dictionary={dictionary.products} categories={categories} />
      <Suspense fallback={<ProductSkeleton />}>
        <Await promise={products}>
          {(products) => (
            <div className="mt-4 grid grow grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <Product key={product.id} product={product} lang={params.lang} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  )
}
