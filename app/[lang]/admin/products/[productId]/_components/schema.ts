import { z } from 'zod'

const MAX_FILE_SIZE = 5000000 // 5mb limit
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const FileArraySchema = z
  .array(z.custom<File>())
  .min(1, 'Please upload at least one image')
  .refine(
    (files) => {
      // Check if all items in the array are instances of the File object
      return files.every((file) => file instanceof File)
    },
    {
      // If the refinement fails, throw an error with this message
      message: 'Expected a file',
    },
  )
  .refine(
    (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
    `File size should be less than 5mb.`,
  )
  .refine(
    (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
    'Only these types are allowed .jpg, .jpeg, .png and .webp',
  )

// const OptionSchema = z.object({
//   label: z.string(),
//   value: z.string(),
// })

const VariantSchema = z.object({
  slug: z.string().min(5, { message: 'Slug must be 5 or more characters long' }),
  color: z.string({ required_error: 'Please enter color' }),
  sizes: z.array(z.string()).min(1, 'Please select at least one size'),
  preview_image: z.string().optional(),
  images: z.union([
    FileArraySchema,
    z.array(z.string()).min(1, 'Please upload at least one image'),
  ]),
})

export const NewProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(5, 'Product name must be 5 or more characters long'),
  description: z.string().optional(),
  price: z.coerce
    .number({
      required_error: 'Please enter product price',
    })
    .gt(0, 'Price should be greater than 0'),
  categories: z.array(z.string()),
  variants: z.array(VariantSchema).min(1, 'Please add at least one color variant'),
})

export type ProductVariantType = z.infer<typeof VariantSchema>

export type NewProductType = z.infer<typeof NewProductSchema>
