'use client'

import { Dialog, Transition } from '@headlessui/react'
import Badge from '@mui/material/Badge'
import { ShoppingBag, X } from 'lucide-react'
import useSWR, { useSWRConfig } from 'swr'
import { Fragment, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

import { CartDictionary } from '@/models/dictionary'
import { Cart } from '@/models/types'
import { Blinker } from '@/components/Loading'
import { formatCurrency } from '@/lib/utils'
import { axiosPrivate } from '@/lib/axios'
import { Locale } from '@/i18n-config'

interface CartSliderProps {
  lang: Locale
  dictionary: CartDictionary
}

const fetcher = async (url: string, token: string) => {
  return axiosPrivate(token)
    .get(url)
    .then((res) => res.data)
}

export default function CartSlider({ lang, dictionary }: CartSliderProps) {
  const { data: session } = useSession()
  const validSession = session?.user?.token && session?.user?.userId
  // Construct the URL string
  const url = validSession ? `/api/carts/${session.user.userId}` : null
  const { data: cart } = useSWR<Cart>(
    validSession ? [url, session.user.token] : null,
    ([url, token]) => fetcher(url as string, token as string),
  )
  const { mutate } = useSWRConfig()
  const cartNumberOfItems = cart?.cartItems?.reduce((prev, cur) => prev + cur.quantity, 0) ?? 0
  // Manage slider and buttons state
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const removeProductFromCart = async (itemId: number) => {
    setLoading(true)
    // Invalid session
    if (!session?.user?.token) {
      setLoading(false)
      return toast.error(dictionary.errorRemovingProduct)
    }
    await axiosPrivate(session.user.token)
      .delete(`/api/carts/cartItem/${itemId}`)
      .then(() => {
        mutate([`/api/carts/${session.user.userId}`, session.user.token])
        toast.success(dictionary.productRemoved)
      })
      .catch(() => toast.error(dictionary.errorRemovingProduct))
      .finally(() => setLoading(false))
  }

  const checkout = async () => {
    setLoading(true)
    // Invalid session
    if (!session?.user?.token) {
      setLoading(false)
      return toast.error(dictionary.errorCreatingOrder)
    }

    await axiosPrivate(session.user.token)
      .post('/api/orders', { userId: session.user.userId })
      .then(() => {
        mutate([`/api/carts/${session.user.userId}`, session.user.token])
        toast.success(dictionary.orderCreated)
      })
      .catch((error) => toast.error(error.response.data.error))
      .finally(() => {
        setLoading(false)
        setOpen(false)
      })
  }

  return (
    <div>
      {!loading && (
        <Badge badgeContent={cartNumberOfItems} color="error">
          <button
            title={`${cartNumberOfItems} products in cart`}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <ShoppingBag size={24} />
          </button>
        </Badge>
      )}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {dictionary.title}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-8">
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cart &&
                                cart.cartItems.map((item) => (
                                  <li key={item.cart_item_id} className="flex py-6">
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <Image
                                        src={item.preview_image || ''}
                                        alt=""
                                        className="object-cover object-center"
                                        sizes="94px"
                                        fill
                                      />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <Link
                                              href={`${lang}/products/${item.product_id}`}
                                              onClick={() => setOpen(false)}
                                            >
                                              {item.name}
                                            </Link>
                                          </h3>
                                          <p className="ml-4">
                                            {formatCurrency({
                                              amount: item.price * item.quantity ?? 0,
                                            })}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                          {dictionary.size} {item.size || ''}
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <p className="text-gray-500">
                                          {dictionary.quantity} {item.quantity}
                                        </p>
                                        <div className="flex">
                                          <button
                                            type="button"
                                            disabled={loading}
                                            className="font-medium text-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={() => removeProductFromCart(item.cart_item_id)}
                                          >
                                            {dictionary.remove}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>{dictionary.subtotal}</p>
                          <p>
                            {formatCurrency({
                              amount:
                                cart?.cartItems.reduce(
                                  (prev, cur) => prev + (cur?.price * cur?.quantity || 0),
                                  0,
                                ) || 0,
                            })}
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">{dictionary.shippinginfo}</p>
                        <div className="mt-6">
                          <button
                            disabled={loading || cart?.cartItems.length === 0}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-6 py-3 
                              text-base font-medium text-white shadow-sm hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-75"
                            onClick={checkout}
                          >
                            {loading ? <Blinker /> : dictionary.checkout}
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            {dictionary.or}&nbsp;
                            <button
                              type="button"
                              className="font-medium text-red-500 hover:text-red-400"
                              onClick={() => setOpen(false)}
                            >
                              {dictionary.continueShopping}
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}
