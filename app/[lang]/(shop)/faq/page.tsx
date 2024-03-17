import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Locale } from '@/i18n-config'
import { getDictionary } from '@/lib/dictionaries/dictionaries'
import { FaqDictionary } from '@/models/dictionary'
import { CreditCard, Map, ThumbsUp, Truck } from 'lucide-react'

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const pageTitle =
    params.lang === 'en'
      ? 'FAQ'
      : params.lang === 'pt'
      ? 'Perguntas Frequentes'
      : 'Preguntas Frecuentes'
  return {
    title: pageTitle + ' | Sneakers Store',
  }
}

export default async function FAQ({ params }: { params: { lang: Locale } }) {
  const dictionary: FaqDictionary = (await getDictionary(params.lang)).faq
  return (
    <div className="m-auto mt-4 flex w-[333px] flex-col gap-y-6 sm:w-[550px] md:w-[650px] lg:w-[840px] lg:gap-y-10">
      <div className="grid grid-cols-2 justify-items-start gap-x-1 gap-y-4 sm:grid-cols-4 sm:justify-items-center">
        <div className="flex items-center gap-x-2">
          <Truck
            className="h-10 w-10 text-red-500 md:h-8 md:w-8 lg:h-12 lg:w-12"
            strokeWidth={1.5}
          />
          <p className="flex flex-col">
            <span className="text-sm font-normal md:text-base">{dictionary.freeShipping}</span>
            <span className="text-xs font-light text-red-500 md:text-xs lg:text-base">
              {dictionary.shippingCondictions}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Map className="h-10 w-10 text-lg text-red-500 lg:h-12 lg:w-12" strokeWidth={1.5} />
          <p className="flex flex-col gap-0">
            <span className="text-sm font-normal md:text-base lg:text-lg">{dictionary.shipTo}</span>
            <span className="text-xs font-light text-red-500 md:text-xs lg:text-base">
              {dictionary.shipCountries}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <CreditCard className="h-10 w-10 text-red-600 lg:h-12 lg:w-12" strokeWidth={1.5} />
          <p className="flex flex-col gap-0">
            <span className="whitespace-pre text-xs font-normal leading-5 md:text-base">
              {dictionary.securePayment}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <ThumbsUp className="h-8 w-8 text-red-600 lg:h-10 lg:w-10" strokeWidth={1.5} />
          <p className="flex flex-col gap-0">
            <span className="text-sm font-normal md:text-base">{dictionary.securePercent}</span>
            <span className="text-xs font-light text-red-500 md:text-xs lg:text-base">
              {dictionary.sslCertificate}
            </span>
          </p>
        </div>
      </div>
      <Accordion defaultValue={['faq1', 'faq2', 'faq3', 'faq4']} type="multiple">
        <AccordionItem value="faq1">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold sm:text-base md:text-lg">
            {dictionary.faq1Question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-zinc-500 sm:text-sm md:text-base">{dictionary.faq1Answer}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq2">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold sm:text-base md:text-lg">
            {dictionary.faq2Question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-zinc-500 sm:text-sm md:text-base">{dictionary.faq2Answer}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq3">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold sm:text-base md:text-lg">
            {dictionary.faq3Question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-zinc-500 sm:text-sm md:text-base">{dictionary.faq3Answer}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq4">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold sm:text-base md:text-lg">
            {dictionary.faq4Question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="whitespace-pre-line text-xs text-zinc-500 sm:text-sm md:text-base">
              {dictionary.faq4Answer}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
