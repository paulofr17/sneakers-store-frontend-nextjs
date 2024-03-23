import { redirect } from 'next/navigation'

import { getDictionary } from '@/lib/dictionaries/dictionaries'
import { OrdersDictionary } from '@/models/dictionary'
import { Order as OrderType } from '@/models/types'
import { axiosPrivate } from '@/lib/axios'
import { Locale } from '@/i18n-config'
import { Order } from './_components/Order'
import { auth } from '@/auth'

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const pageTitle =
    params.lang === 'en'
      ? 'Order history'
      : params.lang === 'pt'
        ? 'Histórico de Encomendas'
        : 'Historial de pedidos'
  return {
    title: pageTitle + ' | Sneakers Store',
  }
}

export default async function Page({ params }: { params: { lang: Locale } }) {
  const session = await auth()
  const dictionary: OrdersDictionary = (await getDictionary(params.lang)).orders

  if (!session) {
    redirect(`/${params.lang}/account/signin`)
  }

  const orders: OrderType[] = await axiosPrivate(session.user.token)
    .get(`/api/orders/${session.user.userId}`)
    .then((response) => response.data)
    .catch(() => [])

  return (
    <div className="flex w-full flex-col px-3 lg:px-[100px]">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {dictionary.title}
      </h1>
      <p className="mt-2 text-sm text-gray-500">{dictionary.description}</p>
      {orders ? (
        <div className="mt-6 flex flex-col gap-2 sm:gap-3">
          {orders.map((order) => (
            <Order key={order.id} order={order} dictionary={dictionary} lang={params.lang} />
            // <div key={order.id} className="flex flex-col">
            //   <div className="w-full rounded-md border border-gray-200 shadow-md">
            //     <div className="grid grid-cols-4 border-b border-gray-200 px-2 py-2 text-xs sm:p-6 sm:text-sm">
            //       <p className="font-medium text-gray-900">{dictionary.orderNumber}</p>
            //       <p className="font-medium text-gray-900">{dictionary.orderDate}</p>
            //       <p className="font-medium text-gray-900">{dictionary.orderStatus}</p>
            //       <p className="font-medium text-gray-900">{dictionary.orderTotal}</p>
            //       <p className="mt-[2px] text-gray-500 sm:mt-1">{order.id}</p>
            //       <p className="mt-[2px] text-gray-500 sm:mt-1">
            //         {order.created_at?.split('T')[0]}
            //       </p>
            //       <p className="mt-[2px] text-gray-500 sm:mt-1">Pending</p>
            //       <p className="mt-[2px] text-gray-500 sm:mt-1">
            //         {formatCurrency({ amount: order.price || 0 })}
            //       </p>
            //     </div>
            //     {order.order_item?.map((item) => (
            //       <div
            //         key={item.id}
            //         className="flex gap-2 border-b border-gray-200 px-2 py-2 sm:gap-4 sm:p-6"
            //       >
            //         <div className="relative aspect-square w-[82px] min-[400px]:w-24 sm:w-40">
            //           <Image
            //             src={item.preview_image || ''}
            //             className="rounded-md object-cover object-center"
            //             alt={item.name}
            //             sizes="(min-width: 640px) 160px, (min-width: 400px) 96px, (min-width: 360px) 82px, calc(92.5vw - 233px)"
            //             fill
            //           />
            //         </div>
            //         <div className="my-1 flex flex-1 flex-col justify-between sm:my-2">
            //           <div className="flex justify-between text-xs text-gray-900 sm:text-sm">
            //             <p>{item.name}</p>
            //             <p>{formatCurrency({ amount: item.totalPrice })}</p>
            //           </div>
            //           <p className="line-clamp-2 text-xs text-gray-500 sm:line-clamp-4 sm:text-sm">
            //             {item.description}
            //           </p>
            //           <div className="flex gap-1 text-xs sm:gap-3 sm:text-sm">
            //             <div className="flex gap-1">
            //               <p className="text-gray-900">{dictionary.size}</p>
            //               <p className="text-gray-500">{item.size}</p>
            //             </div>
            //             <div className="flex gap-1">
            //               <p className="text-gray-900">{dictionary.quantity}</p>
            //               <p className="text-gray-500">x{item.quantity}</p>
            //             </div>
            //             <Link
            //               href={`/${params.lang}/products/${item.slug}`}
            //               className="ml-auto line-clamp-1 font-medium text-red-500 hover:opacity-70"
            //             >
            //               {dictionary.viewProduct}
            //             </Link>
            //           </div>
            //         </div>
            //       </div>
            //     ))}
            //   </div>
            // </div>
          ))}
        </div>
      ) : (
        <p className="mt-14 text-base font-medium">{dictionary.emptyOrders}</p>
      )}
    </div>
  )
}
