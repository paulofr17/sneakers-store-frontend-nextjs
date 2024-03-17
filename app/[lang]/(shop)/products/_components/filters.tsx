'use client'

import '@mantine/core/styles.css'
import { MantineProvider, RangeSlider } from '@mantine/core'
import { useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ProductsDictionary } from '@/models/dictionary'
import { formatCurrency } from '@/lib/utils'

interface FiltersProps {
  dictionary: ProductsDictionary
  categories: string[]
}

export default function Filters({ dictionary, categories }: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const min = Number(searchParams.get('min')) || 50
  const max = Number(searchParams.get('max')) || 250
  const [price, setPrice] = useState([min, max])
  const createQueryString = useCallback(
    (newParams: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams)
      newParams.forEach(({ name, value }) => params.set(name, value))
      return params.toString()
    },
    [searchParams],
  )
  return (
    <div>
      <div className="sticky top-0 flex w-full flex-col sm:w-32 md:w-40 lg:w-44 xl:w-52">
        <Accordion defaultValue={['brands', 'price']} type="multiple">
          <AccordionItem value="brands">
            <AccordionTrigger>{dictionary.brands}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col justify-start gap-y-2 text-base text-gray-400">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="text-left hover:text-black"
                    onClick={() => {
                      router.push(
                        pathname + '?' + createQueryString([{ name: 'brand', value: category }]),
                      )
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger>{dictionary.price}</AccordionTrigger>
            <AccordionContent>
              <div>
                <div className="px-1">
                  <MantineProvider>
                    <RangeSlider
                      mt={2}
                      min={50}
                      max={250}
                      defaultValue={[price[0], price[1]]}
                      color="gray"
                      step={5}
                      size={'sm'}
                      thumbSize={14}
                      onChange={(value) => setPrice(value)}
                      onChangeEnd={(value) => {
                        router.push(
                          pathname +
                            '?' +
                            createQueryString([
                              { name: 'min', value: value[0].toString() },
                              { name: 'max', value: value[1].toString() },
                            ]),
                        )
                      }}
                      label={() => ''}
                    />
                  </MantineProvider>
                </div>
                <div className="mt-1 flex justify-between">
                  <p>{formatCurrency({ amount: price[0] })}</p>
                  <p>{formatCurrency({ amount: price[1] })}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
