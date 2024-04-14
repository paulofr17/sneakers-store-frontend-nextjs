'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'

import { Blinker } from '@/components/Loading'
import { Locale } from '@/i18n-config'
import { axiosPrivate } from '@/lib/axios'
import { ProductsDictionary } from '@/models/dictionary'
import { ProductVariant } from '@/models/types'

interface productSelectionProps {
  lang: Locale
  selectedVariant: ProductVariant
  dictionary: ProductsDictionary
}

const sizeButtonColor = (selectedSize: string | null, item: { quantity: number; size: string }) => {
  if (item.quantity === 0) return 'bg-zinc-300 text-zinc-500'
  return item.size !== selectedSize
    ? 'border border-zinc-400 bg-white text-black hover:border-red-500 hover:bg-red-500 hover:text-white'
    : 'border border-red-500 bg-red-500 text-white'
}

export default function ProductSelection({
  lang,
  selectedVariant,
  dictionary,
}: productSelectionProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false)
  const isMutating = loading // || isPending

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const product = selectedVariant.product_stock.find((product) => product.size === selectedSize)
    if (!product || !session) {
      setLoading(false)
      !session ? toast.error(dictionary.loginRequired) : toast.error(dictionary.errorAddingProduct)
      return router.push(`/${lang}/account/signin`)
    }

    await axiosPrivate(session.user.token)
      .post(`/api/carts/cartItem`, {
        cart_id: session?.user?.cartId,
        product_stock_id: product.id,
        quantity: 1,
      })
      .then(() => {
        toast.success(dictionary.productAdded)
        mutate([`/api/carts/${session.user.userId}`, session.user.token])
      })
      .catch(() => toast.error(dictionary.errorAddingProduct))
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid grid-cols-4 gap-x-2 gap-y-2">
        {selectedVariant.product_stock
          .sort((a, b) => (Number(a.size) > Number(b.size) ? 1 : -1))
          .map((item, index) => (
            <button
              key={index}
              className={`${sizeButtonColor(
                selectedSize,
                item,
              )} rounded-md p-2 text-sm font-semibold`}
              onClick={() => setSelectedSize(selectedSize === item.size ? null : item.size)}
              disabled={isMutating || item.quantity === 0}
            >
              {item.size}
            </button>
          ))}
      </div>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className={`${
            selectedSize === null
              ? 'bg-zinc-300 text-zinc-500'
              : 'bg-red-500 text-white hover:opacity-70'
          } w-full rounded-full px-5 py-2 text-sm font-semibold`}
          disabled={selectedSize === null || isMutating}
        >
          {isMutating ? <Blinker /> : dictionary.addToCart}
        </button>
      </form>
    </div>
  )
}
