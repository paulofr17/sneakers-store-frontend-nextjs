import axios from '@/lib/axios'
import { CreateProductForm } from '@/app/[lang]/admin/products/[productId]/_components/CreateProductForm'
import { unstable_cache as unstableCache } from 'next/cache'

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const fetchProduct = unstableCache(
    async () =>
      axios
        .get(`/api/products/${params.productId}`)
        .then((res) => res.data)
        .catch(() => null),
    [`/admin/products/${params.productId}`],
    { tags: [`/admin/products/${params.productId}`] },
  )

  const sizeOptions = await axios.get(`/api/sizes`).then((res) => {
    return res.data.map((size: string) => ({ label: size, value: size }))
  })
  const colorOptions = await axios.get(`/api/colors`).then((res) => {
    return res.data.map((color: string) => ({ label: color, value: color }))
  })
  const categoryOptions = await axios.get(`/api/categories`).then((res) => {
    return res.data.map((category: string) => ({
      label: category,
      value: category,
    }))
  })

  const existingProduct = await fetchProduct()

  return (
    <CreateProductForm
      initialData={existingProduct}
      sizeOptions={sizeOptions}
      colorOptions={colorOptions}
      categoryOptions={categoryOptions}
    />
  )
}
