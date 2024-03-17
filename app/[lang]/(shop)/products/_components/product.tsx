'use client'

import Image from 'next/image'
import Link from 'next/link'

import { formatCurrency } from '@/lib/utils'
import { Product as ProductType } from '@/models/types'
import { Locale } from '@/i18n-config'
import { useState } from 'react'

type productProps = {
  product: ProductType
  lang: Locale
}

export default function Product({ product, lang }: productProps) {
  const [currentVariant, setCurrentVariant] = useState(product?.variants[0])
  if (product && currentVariant) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          className="relative aspect-square w-full hover:opacity-60 "
          href={`/${lang}/products/` + currentVariant.slug}
        >
          <Image
            src={currentVariant.preview_image}
            fill
            alt={product.name}
            className="rounded-md object-cover shadow-md"
          />
        </Link>
        {product.variants && (
          <div className="flex w-full gap-1">
            {product.variants.map((variant) => (
              <Link
                key={variant.color}
                className="relative aspect-square w-full max-w-12"
                href={`/${lang}/products/` + variant.slug}
              >
                <Image
                  src={variant.preview_image}
                  alt={variant.color}
                  className={`rounded-md object-cover shadow-sm ${
                    currentVariant.id === variant.id
                      ? 'border border-solid border-black'
                      : 'hover:border hover:border-solid hover:border-black'
                  }`}
                  onMouseEnter={() => setCurrentVariant(variant)}
                  fill
                />
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-between gap-[2px] text-xs text-gray-500 lg:text-sm xl:text-base">
          <span className="line-clamp-2 font-medium">{product.name}</span>
          <span className="font-semibold text-gray-700">
            {formatCurrency({ amount: product.price || 0 })}
          </span>
        </div>
      </div>
    )
  }
}
