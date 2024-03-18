'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'
import { Skeleton } from '@/components/ui/skeleton'

interface productSwiperProps {
  productImages: string[]
}

export default function ProductSwiper({ productImages }: productSwiperProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>()
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    setDidMount(true)
  }, [])

  if (!didMount) {
    return (
      <div className="md:max-w[550px] w-full max-w-[650px] px-3 min-[450px]:px-5 md:max-w-[450px] md:px-0"></div>
    )
  }

  return (
    <section className="md:max-w[550px] w-full max-w-[650px] px-3 min-[450px]:px-5 md:max-w-[450px] md:px-0">
      <Swiper
        loop={true}
        spaceBetween={10}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[Thumbs]}
        className="aspect-square w-full rounded-lg"
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex h-full w-full items-center justify-center">
              <Image
                src={image || ''}
                alt=""
                className="block h-full w-full rounded-md object-cover"
                sizes="(min-width: 780px) 450px, (min-width: 700px) 610px, (min-width: 520px) calc(81.25vw + 58px), (min-width: 440px) calc(40vw + 240px), calc(83.33vw + 26px)"
                fill
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={8}
        slidesPerView={4}
        watchSlidesProgress={true}
        modules={[Thumbs]}
        className="thumbs thumbSwiper mt-2 h-[20%] w-full rounded-lg"
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={index}>
            <button className="relative flex aspect-square w-full items-center justify-center">
              <Image
                src={image || ''}
                alt=""
                className="block h-full w-full rounded-md object-cover"
                sizes="(min-width: 780px) 107px, (min-width: 700px) 147px, (min-width: 520px) calc(20.63vw + 7px), (min-width: 440px) calc(10vw + 54px), (min-width: 340px) calc(18.75vw + 9px), calc(-1040vw + 3396px)"
                fill
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
