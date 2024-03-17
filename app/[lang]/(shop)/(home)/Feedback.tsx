'use client'

import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import feedback from '@/assets/feedback.jpg'

export default function Feedback() {
  const images = [feedback, feedback, feedback]
  return (
    <Swiper
      centeredSlides={true}
      slidesPerView={1}
      pagination={{ type: 'bullets', clickable: true }}
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      className="swiperPadding h-full w-full items-center justify-center rounded-lg"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className="text-center">
          <div className="relative flex h-full w-full justify-center">
            <Image
              src={image.src}
              alt=""
              className="relative object-contain"
              sizes="(min-width: 640px) 500px, 300px"
              fill
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
