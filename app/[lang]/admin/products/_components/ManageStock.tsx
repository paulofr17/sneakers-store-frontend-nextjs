'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { updateStock } from '@/actions/ManageStock/action'
import { ManageStockType } from '@/actions/ManageStock/schema'
import { Blinker } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Product, ProductVariant } from '@/models/types'
import { toast } from 'sonner'

interface ManageStockProps {
  products: Product[]
}

export function ManageStock({ products }: ManageStockProps) {
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductVariant | null>(null)
  const productVariants = products.reduce<{ label: string; value: string }[]>((acc, product) => {
    return acc.concat(
      product.variants.map((variant) => ({
        label: variant.slug,
        value: variant.slug,
      })),
    )
  }, [])

  const form = useForm<ManageStockType>({
    defaultValues: {
      stock:
        selectedProduct?.product_stock.map((item) => ({
          size: item.size,
          quantity: item.quantity,
        })) || [],
    },
  })

  const stock = useWatch({ control: form.control, name: 'stock' })

  async function handleSubmit(formData: ManageStockType) {
    if (!selectedProduct) {
      return toast.error('Please select a product')
    }
    const response = await updateStock(selectedProduct.id, formData)
    if (response.error) {
      return toast.error(response.error)
    }
    toast.success('Stock updated')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Stock</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[700px]">
        <DialogHeader className="mx-auto">
          <DialogTitle>Manage Stock</DialogTitle>
        </DialogHeader>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="mb-4 mt-4">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[250px] justify-between"
            >
              {selectedProduct
                ? productVariants.find((variant) => variant.value === selectedProduct.slug)?.label
                : 'Select product...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search product..." />
              <CommandEmpty>No product found.</CommandEmpty>
              <CommandGroup className="max-h-80 overflow-auto">
                {productVariants.map((product) => (
                  <CommandItem
                    key={product.value}
                    value={product.value}
                    onSelect={(selected) => {
                      if (selected === selectedProduct?.slug) {
                        setSelectedProduct(null)
                        form.setValue('stock', [])
                      } else {
                        const newSelectedProduct = products
                          .find((product) =>
                            product.variants.find((variant) => variant.slug === selected),
                          )
                          ?.variants.find((variant) => variant.slug === selected)
                        setSelectedProduct(newSelectedProduct || null)
                        form.setValue('stock', newSelectedProduct?.product_stock || [])
                      }
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedProduct?.slug === product.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {product.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedProduct && (
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mb-4 grid grid-cols-3 gap-2 min-[500px]:grid-cols-4 sm:grid-cols-6 sm:gap-4">
              {stock.map((item, index) => {
                return (
                  <div key={item.size} className="flex flex-row items-center gap-2 sm:gap-4">
                    <Label>{item.size}</Label>
                    <Input
                      type="number"
                      {...form.register(`stock.${index}.quantity`)}
                      className="w-14"
                    />
                  </div>
                )
              })}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Blinker /> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
