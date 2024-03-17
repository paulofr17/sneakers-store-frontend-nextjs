import parse from 'html-react-parser'

import ProductSwiper from '@/app/[lang]/(shop)/products/[slug]/_components/productSwiper'
import ProductSelection from '@/app/[lang]/(shop)/products/[slug]/_components/productSelection'
import { formatCurrency } from '@/lib/utils'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import { Dictionary } from '@/models/dictionary'
import { Product } from '@/models/types'
import { Locale } from '@/i18n-config'
import axios from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { slug: string; lang: Locale } }) {
  const product: Product = await axios
    .get(`/api/products-variants/${params.slug}`)
    .then((res) => res.data)
  return {
    title: product.name + ' | Sneakers Store',
  }
}

export default async function ProductPage({ params }: { params: { slug: string; lang: Locale } }) {
  const dictionary: Dictionary = await getDictionary(params.lang)
  const product: Product = await axios
    .get(`/api/products-variants/${params.slug}`)
    .then((res) => res.data)
  const selectedVariant = product.variants.find((variant) => variant.slug === params.slug)

  if (product && selectedVariant) {
    return (
      <div className="m-auto flex h-full w-full flex-col items-center md:flex-row md:items-start md:gap-x-4 md:px-4 lg:max-w-[825px] lg:gap-x-6 lg:px-0 xl:max-w-[950px]">
        <ProductSwiper productImages={[selectedVariant.preview_image, ...selectedVariant.image]} />
        <div className="mt-6 flex w-full max-w-[650px] flex-col gap-y-2 px-3 min-[450px]:px-5 md:mt-0 md:max-w-[300px] md:items-start md:gap-y-8 md:px-0 lg:max-w-[650px]">
          <p className="text-xl font-semibold tracking-wider md:text-2xl">{product.name}</p>
          <p className="texl-xl font-semibold tracking-wider text-red-500 md:text-2xl">
            {formatCurrency({ amount: product.price || 0 })}
          </p>
          <p className="text-xs font-medium text-zinc-500 md:text-sm">
            {parse(product.description || '')}
          </p>
          <div className="flex w-full gap-2">
            {product.variants.map((variant) => (
              <Link
                key={variant.color}
                className="relative aspect-square w-full max-w-24"
                href={`/${params.lang}/products/` + variant.slug}
              >
                <Image
                  src={variant.preview_image}
                  alt={variant.color}
                  className={`rounded-md object-cover shadow-sm ${
                    selectedVariant.slug === variant.slug
                      ? 'border border-solid border-black'
                      : 'hover:border hover:border-solid hover:border-black'
                  }`}
                  fill
                />
                <p>
                  {variant.id} - {selectedVariant.id}
                </p>
              </Link>
            ))}
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <p className="text-sm font-medium text-zinc-500 md:text-base">
              {dictionary.products.size}
            </p>
            <ProductSelection
              lang={params.lang}
              selectedVariant={selectedVariant}
              dictionary={dictionary.products}
            />
          </div>
        </div>
      </div>
    )
  }
}
