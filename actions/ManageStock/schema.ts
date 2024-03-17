import { z } from 'zod'

export const ManageStockSchema = z.object({
  stock: z
    .array(
      z.object({
        size: z.string(),
        quantity: z.coerce.number(),
      }),
    )
    .min(1, 'Please add at least one size'),
})

export type ManageStockType = z.infer<typeof ManageStockSchema>
