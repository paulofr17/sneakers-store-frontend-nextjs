'use client'

import { Multiselect } from '@/components/shared/Multiselect'
import { Key, useState } from 'react'
import { NewProductType, ProductVariantType } from './schema'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

type Option = {
  label: string
  value: string
}

interface VariantFormProps {
  index: number
  sizeOptions: Option[]
  variant: ProductVariantType
}

export function VariantForm({ index, sizeOptions, variant }: VariantFormProps) {
  const [sizes, setSizes] = useState<Option[]>(
    variant.sizes.map((size) => ({ label: size, value: size })),
  )
  const form = useFormContext<NewProductType>()
  const variantImages = useWatch({
    name: `variants.${index}.images`,
  })
  const variantSizes = useWatch({
    name: `variants.${index}.sizes`,
  })

  if (JSON.stringify(sizes.map((size) => size.value)) !== JSON.stringify(variantSizes)) {
    form.setValue(
      `variants.${index}.sizes`,
      sizes.map((size) => size.value),
    )
  }
  return (
    <div className="col-span-4 mt-2 flex flex-col gap-2">
      <h2 className="mb-2 text-center text-lg font-semibold">
        {variant.color.charAt(0).toUpperCase() + variant.color.slice(1)} color variant
      </h2>
      <div className="flex w-full gap-2">
        <div className="flex w-[300px] shrink-0 flex-col gap-2">
          <FormField
            control={form.control}
            name={`variants.${index}.slug`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-[225px] shrink-0 flex-col gap-2">
          <FormField
            control={form.control}
            name={`variants.${index}.images`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <Input
                    multiple
                    type="file"
                    accept=".jpg, .jpeg, .png,"
                    onChange={(event) =>
                      field.onChange(event.target.files ? Array.from(event.target.files) : [])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-1">
            <FormLabel>Sizes</FormLabel>
            <div className="h-fit">
              <Multiselect options={sizeOptions} selected={sizes} setSelected={setSizes} />
            </div>
          </div>
          {form.formState.errors.variants?.[index]?.sizes?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.variants?.[index]?.sizes?.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {variantImages.map((item: File | string, index: Key | null | undefined) => {
          const imageUrl =
            typeof window === 'undefined'
              ? (item as string)
              : item instanceof File
                ? URL.createObjectURL(item)
                : item

          return (
            <div key={index} className="relative h-32 w-full max-w-32">
              <Image
                fill
                src={imageUrl}
                alt={`${variant.color} variant image`}
                className="object-contain"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
