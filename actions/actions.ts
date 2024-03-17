'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import axios from '@/lib/axios'

export async function revalidatePage(path: string) {
  revalidatePath(path, 'page')
}

export async function invalidateCache(key: string) {
  revalidateTag(key)
}

export async function deleteProduct(productId: number) {
  try {
    const response = await axios.delete(`/api/products/${productId}`)
    if (response.status === 200) {
      revalidatePath('/[lang]/admin/products')
      return { data: response.data }
    }
    return { error: 'Error deleting product' }
  } catch (error) {
    return { error: 'Error processing request, please retry...' }
  }
}
