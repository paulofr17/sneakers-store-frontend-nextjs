'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import axios from '@/lib/axios'

import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { NewProductSchema, NewProductType } from './schema'
import { Input } from '@/components/ui/input'
import { Multiselect } from '@/components/shared/Multiselect'
import { Blinker } from '@/components/Loading'
import { VariantForm } from './VariantForm'
import { toast } from 'sonner'
import { invalidateCache } from '@/actions/actions'

type Option = {
  label: string
  value: string
}

interface ProductFormProps {
  initialData: NewProductType
  sizeOptions: Option[]
  colorOptions: Option[]
  categoryOptions: Option[]
}

export function CreateProductForm({
  initialData,
  sizeOptions,
  colorOptions,
  categoryOptions,
}: ProductFormProps) {
  const router = useRouter()
  const [colors, setColors] = useState<Option[]>(
    initialData
      ? initialData.variants.map((variant) => ({ label: variant.color, value: variant.color }))
      : [],
  )
  const [categories, setCategories] = useState<Option[]>(
    initialData
      ? initialData.categories.map((category) => ({ label: category, value: category }))
      : [],
  )

  const toastSucessMessage = initialData ? 'Product updated.' : 'Product created.'
  const toastErrorMessage = initialData ? 'Failed to update product.' : 'Failed to create product.'
  const buttonTitle = initialData ? 'Save changes' : 'Create'

  const form = useForm<NewProductType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          name: '',
          description: '',
          price: 0,
          categories: [],
          variants: [],
        },
  })
  const { fields, update, replace } = useFieldArray({
    control: form.control,
    name: 'variants',
  })
  if (
    JSON.stringify(categories.map((category) => category.value)) !==
    JSON.stringify(form.getValues('categories'))
  ) {
    form.setValue(
      'categories',
      categories.map((category) => category.value),
      { shouldValidate: true },
    )
  }

  if (
    JSON.stringify(colors.map((color) => color.value)) !==
    JSON.stringify(form.getValues('variants').map((item) => item.color))
  ) {
    const selectedColors = colors.map((color) => color.value)
    const newVariants = form
      .getValues('variants')
      .filter((variant) => selectedColors.includes(variant.color))
    selectedColors.forEach((color) => {
      if (!newVariants.some((item) => item.color === color)) {
        newVariants.push({
          color,
          images: [],
          sizes: [],
          slug: form.getValues('name')
            ? `${form.getValues('name').replaceAll(' ', '-')}-${color}`.toLowerCase()
            : '',
        })
      }
    })
    replace(newVariants)
  }

  const handleSubmit = async (data: NewProductType) => {
    const formData = new FormData()
    formData.append('jsonData', JSON.stringify(data))
    data.variants.forEach((variant) => {
      const images: (string | File)[] = variant.images
      if (images.every((item) => item instanceof File)) {
        formData.append(`variants[${variant.color}][preview_image]`, images[0])
        images.forEach((image, imageIndex) => {
          formData.append(`variants[${variant.color}][images][${imageIndex}]`, image as File)
        })
      }
    })
    try {
      if (initialData) {
        await axios
          .put(`/api/products/products-variants/${initialData.id}`, formData)
          .then(async () => {
            await invalidateCache(`/admin/products/${initialData.id}`)
            router.push(`/admin/products/`)
            toast.success(toastSucessMessage)
          })
          .catch((error) => {
            error?.response?.data?.error
              ? toast.error(error.response.data.error)
              : toast.error(toastErrorMessage)
          })
      } else {
        await axios
          .post('/api/products/products-variants/', formData)
          .then(() => {
            router.push(`/admin/products/`)
            router.refresh()
            toast.success(toastSucessMessage)
          })
          .catch((error) => {
            error?.response?.data?.error
              ? toast.error(error.response.data.error)
              : toast.error(toastErrorMessage)
          })
      }
    } catch (error) {
      toast.error(toastErrorMessage)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-4 gap-x-1 gap-y-2 lg:gap-x-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product name"
                    {...field}
                    onBlur={(event) => {
                      form.getValues('variants').forEach((variant, index) => {
                        if (variant.slug === '') {
                          update(index, {
                            ...form.getValues('variants')[index],
                            slug: `${event.target.value.replaceAll(' ', '-')}-${variant.color}`.toLowerCase(),
                          })
                        }
                      })
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Product Price" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Product description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-4 grid grid-cols-3 gap-x-1 gap-y-2 lg:gap-x-4">
            <div className="space-y-1">
              <FormLabel>Colors</FormLabel>
              <div className="h-fit">
                <Multiselect options={colorOptions} selected={colors} setSelected={setColors} />
                {form.formState.errors.variants && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.variants.root?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <FormLabel>Categories</FormLabel>
              <div className="h-fit">
                <Multiselect
                  options={categoryOptions}
                  selected={categories}
                  setSelected={setCategories}
                />
                {form.formState.errors.categories && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.categories.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {fields.map((variant, index) => (
            <div key={variant.id} className="col-span-4">
              <VariantForm index={index} sizeOptions={sizeOptions} variant={variant} />
            </div>
          ))}
        </div>
        <Button type="submit" className="mt-10 w-52" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Blinker /> : buttonTitle}
        </Button>
      </form>
    </Form>
  )
}
