'use server'

import { ManageStockSchema, ManageStockType } from '@/actions/ManageStock/schema'
import axios from '@/lib/axios'

export async function updateStock(productVariantId: number, formData: ManageStockType) {
  try {
    const validFormData = ManageStockSchema.safeParse(formData)
    if (!validFormData.success) {
      return { error: 'Invalid data provided' }
    }

    const updatedStock = await axios
      .put(`/api/stock/${productVariantId}`, formData.stock)
      .then((res) => res.data)

    return updatedStock
  } catch (error) {
    return { error: 'Error updating stock' }
  }
}
