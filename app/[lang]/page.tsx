import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

import { HomeProductSwiper } from '@/app/[lang]/_components/HomeProductSwiper'
import HomeProductSkeleton from '@/app/[lang]/_components/HomeProductSkeleton'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import { Dictionary } from '@/models/dictionary'
import { HomePageProduct } from '@/models/types'
import mainImage from '@/assets/main.png'
import Await from '@/components/Await'
import { Locale } from '@/i18n-config'
import axios from '@/lib/axios'

export default async function Home({ params }: { params: { lang: Locale } }) {
  const dictionary: Dictionary = await getDictionary(params.lang)
  const bestSellersProducts: Promise<HomePageProduct[]> = axios
    .get('/api/orders/bestSellers')
    .then((response) => response.data)
    .catch(() => [])
  const newArrivalsProducts: Promise<HomePageProduct[]> = axios
    .get('/api/products-variants/new_arrivals')
    .then((response) => response.data)
    .catch(() => [])

  return (
    <div className="flex flex-col gap-y-8 px-2 sm:gap-y-12 md:gap-y-16 lg:px-[100px] xl:gap-y-20">
      <div className="relative mx-auto flex aspect-video h-full max-h-[700px] w-full max-w-[1720px] justify-center text-center">
        <Image
          src={mainImage.src}
          alt="Sneakers Store"
          className="rounded-md object-cover shadow-xl"
          sizes="(min-width: 2040px) 1720px, (min-width: 1040px) calc(91.53vw - 129px), calc(100vw - 24px)"
          fill
          priority
        />
        <div className="absolute top-1/2 z-0 flex">
          <Link
            href={`${params.lang}/products`}
            className="rounded-xl border border-zinc-200 p-2 text-white transition hover:bg-zinc-500 hover:font-semibold"
          >
            {dictionary.home.shopNow}
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-semibold tracking-[0.05em]">
          {dictionary.home.bestSellers}
        </span>
        <Suspense fallback={<HomeProductSkeleton />}>
          <Await promise={bestSellersProducts}>
            {(bestSellersProducts) => (
              <div className="w-full">
                <HomeProductSwiper products={bestSellersProducts} lang={params.lang} />
              </div>
            )}
          </Await>
        </Suspense>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-semibold tracking-[0.05em]">
          {dictionary.home.newProducts}
        </span>
        <Suspense fallback={<HomeProductSkeleton />}>
          <Await promise={newArrivalsProducts}>
            {(newArrivalsProducts) => (
              <div className="w-full">
                <HomeProductSwiper products={newArrivalsProducts} lang={params.lang} />
              </div>
            )}
          </Await>
        </Suspense>
      </div>
      {/* <div className="mx-auto flex h-[500px] w-[300px] flex-col gap-y-4 text-center sm:h-[700px] sm:w-[500px]">
        <p className="text-2xl font-normal tracking-[0.05em]">{dictionary.home.testimonials}</p>
        <Feedback />
      </div> */}
    </div>
  )
}
