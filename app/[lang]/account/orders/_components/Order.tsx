'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { OrdersDictionary } from '@/models/dictionary'
import { Order } from '@/models/types'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Locale } from '@/i18n-config'

interface OrderItemProps {
  order: Order
  dictionary: OrdersDictionary
  lang: Locale
}

export function Order({ order, dictionary, lang }: OrderItemProps) {
  const [showDetails, setShowDetails] = useState(false)
  return (
    <div key={order.id} className="flex flex-col">
      <div className="w-full rounded-md border border-gray-200 shadow-md">
        <div className="flex justify-between border-b border-gray-200 px-2 py-2 text-xs sm:p-6 sm:text-sm">
          <div className="grid w-full max-w-[800px] grid-cols-5 text-center">
            <p className="font-medium text-gray-900">{dictionary.orderNumber}</p>
            <p className="font-medium text-gray-900">{dictionary.orderDate}</p>
            <p className="font-medium text-gray-900">{dictionary.orderStatus}</p>
            <p className="font-medium text-gray-900">{dictionary.quantity.slice(0, -1)}</p>
            <p className="font-medium text-gray-900">{dictionary.orderTotal}</p>
            <p className="mt-[2px] text-gray-500 sm:mt-1">{order.id}</p>
            <p className="mt-[2px] text-gray-500 sm:mt-1">{order.created_at?.split('T')[0]}</p>
            <p className="mt-[2px] text-gray-500 sm:mt-1">Pending</p>
            <p className="mt-[2px] text-gray-500 sm:mt-1">{order.quantity}</p>
            <p className="mt-[2px] text-gray-500 sm:mt-1">
              {formatCurrency({ amount: order.price || 0 })}
            </p>
          </div>
          <Button variant={'ghost'} onClick={() => setShowDetails((prev) => !prev)}>
            <ChevronDown
              className={`${showDetails && 'rotate-180'} size-4 text-gray-700 transition sm:size-5 lg:size-6`}
            />
          </Button>
        </div>
        {showDetails &&
          order.order_item?.map((item) => (
            <div
              key={item.id}
              className="flex gap-2 border-b border-gray-200 px-2 py-2 sm:gap-4 sm:p-6"
            >
              <div className="relative aspect-square w-[82px] min-[400px]:w-24 sm:w-40">
                <Image
                  src={item.preview_image || ''}
                  className="rounded-md object-cover object-center"
                  alt={item.name}
                  sizes="(min-width: 640px) 160px, (min-width: 400px) 96px, (min-width: 360px) 82px, calc(92.5vw - 233px)"
                  fill
                />
              </div>
              <div className="my-1 flex flex-1 flex-col justify-between sm:my-2">
                <div className="flex justify-between text-xs text-gray-900 sm:text-sm">
                  <p>{item.name}</p>
                  <p>{formatCurrency({ amount: item.totalPrice })}</p>
                </div>
                <p className="line-clamp-2 text-xs text-gray-500 sm:line-clamp-4 sm:text-sm">
                  {item.description}
                </p>
                <div className="flex gap-1 text-xs sm:gap-3 sm:text-sm">
                  <div className="flex gap-1">
                    <p className="text-gray-900">{dictionary.size}</p>
                    <p className="text-gray-500">{item.size}</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="text-gray-900">{dictionary.quantity}</p>
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <Link
                    href={`/${lang}/products/${item.slug}`}
                    className="ml-auto line-clamp-1 font-medium text-red-500 hover:opacity-70"
                  >
                    {dictionary.viewProduct}
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
