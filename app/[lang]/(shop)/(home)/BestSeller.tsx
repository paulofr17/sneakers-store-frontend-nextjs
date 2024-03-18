'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { formatCurrency } from '@/lib/utils'
import { Locale } from '@/i18n-config'
import { BestSellerProduct } from '@/models/types'
import { useEffect, useState } from 'react'

interface BestSellerProps {
  products: BestSellerProduct[]
  lang: Locale
}

export function BestSeller({ products, lang }: BestSellerProps) {
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    setDidMount(true)
  }, [])

  if (!didMount) {
    return null
  }

  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={5}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1250: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        1350: {
          slidesPerView: 5,
          spaceBetween: 10,
        },
      }}
      className="h-full w-full rounded-lg"
    >
      {products.map((product, index) => (
        <SwiperSlide key={index}>
          <div className="relative flex h-full w-full flex-col">
            <Link
              href={`/${lang}/products/${product.slug}`}
              className="relative h-full w-full hover:opacity-60"
            >
              <Image
                src={product.image}
                alt=""
                loading="lazy"
                className="relative rounded-md object-cover"
                sizes="(min-width: 2040px) 336px, (min-width: 1380px) calc(17.34vw - 14px), (min-width: 1280px) calc(18.75vw + 18px), (min-width: 1060px) calc(30vw - 44px), (min-width: 780px) 30.77vw, (min-width: 400px) calc(49.17vw - 11px), calc(100vw - 24px)"
                fill
              />
            </Link>
            <div className="flex flex-col items-center justify-between pt-1 text-xs text-gray-500 lg:text-sm xl:text-base">
              <span className="line-clamp-2">{product.name}</span>
              <span className="font-medium text-gray-700">
                {formatCurrency({ amount: product.price || 0 })}
              </span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
