'use client'

import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import {
  ChakraProvider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Locale } from '@/i18n-config'
import { CacheProvider } from '@chakra-ui/next-js'
import { HomeDictionary } from '@/models/dictionary'

interface SideBarProps {
  lang: Locale
  dictionary: HomeDictionary
  categories: string[]
}

const linkClasses = (pathname: string, link: string) => {
  if (pathname === link) {
    return 'border-b border-gray-200 px-6 py-4 transition text-black font-semibold'
  }
  return 'border-b border-gray-200 px-6 py-4 transition hover:text-black'
}

export default function SideBar({ lang, dictionary, categories }: SideBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: session } = useSession()
  const pathname = usePathname()
  return (
    <div className="block flex-1 md:hidden">
      <CacheProvider>
        <ChakraProvider>
          <button onClick={() => onOpen()}>
            <MenuIcon size={32} />
          </button>
          <Drawer onClose={onClose} isOpen={isOpen} size={'xs'} placement="left">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader className="border-b border-gray-300">{dictionary.search}</DrawerHeader>
              <DrawerBody className="m-0 p-0">
                <ul className="flex flex-col text-lg text-gray-500">
                  {pathname.startsWith(`/${lang}/admin`) ? (
                    <>
                      <li
                        className={linkClasses(pathname, `/${lang}/admin`)}
                        onClick={() => onClose()}
                      >
                        <Link href={`/${lang}/admin`}>Overview</Link>
                      </li>
                      <li
                        className={linkClasses(pathname, `/${lang}/admin/products`)}
                        onClick={() => onClose()}
                      >
                        <Link href={`/${lang}/admin/products`}>Products</Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className={linkClasses(pathname, `/${lang}`)} onClick={() => onClose()}>
                        <Link href={`/${lang}`}>{dictionary.homepage}</Link>
                      </li>
                      <li
                        className={linkClasses(pathname, `/${lang}/products`)}
                        onClick={() => onClose()}
                      >
                        <Link href={`/${lang}/products`}>{dictionary.shop}</Link>
                      </li>
                      <li className="border-b border-gray-200 px-6 py-4 transition hover:text-black">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="Produtos" className="border-0">
                            <AccordionTrigger className="m-0 p-0">
                              {dictionary.brands}
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="mt-4 flex flex-col gap-y-3 text-base text-gray-400">
                                {categories.map((category) => (
                                  <li key={category} onClick={() => onClose()}>
                                    <Link href={`/${lang}/products?brand=` + category}>
                                      <p className="hover:text-black">{category}</p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </li>
                      <li
                        className={linkClasses(pathname, `/${lang}/faq`)}
                        onClick={() => onClose()}
                      >
                        <Link href={`/${lang}/faq`}>{dictionary.faq}</Link>
                      </li>
                    </>
                  )}
                  {!session && (
                    <>
                      <li
                        className={linkClasses(pathname, `/${lang}/account/signin`)}
                        onClick={() => onClose()}
                      >
                        <Link href={`/${lang}/account/signin`}>{dictionary.login}</Link>
                      </li>
                      <li
                        className={linkClasses(pathname, `/${lang}/account/signup`)}
                        onClick={() => onClose()}
                      >
                        <Link href={`/${lang}/account/signup`}>{dictionary.register}</Link>
                      </li>
                    </>
                  )}
                  <li className="border-b border-gray-200 px-6 py-4 transition hover:text-black">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="Produtos" className="border-0">
                        <AccordionTrigger className="m-0 p-0">
                          {dictionary.language}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="mt-4 flex flex-col gap-y-3 text-base text-gray-400">
                            <li
                              onClick={() => onClose()}
                              className={
                                pathname.startsWith('/pt')
                                  ? 'font-medium text-black'
                                  : 'hover:text-black'
                              }
                            >
                              <Link href={`/pt`}>PT</Link>
                            </li>
                            <li
                              onClick={() => onClose()}
                              className={
                                pathname.startsWith('/es')
                                  ? 'font-medium text-black'
                                  : 'hover:text-black'
                              }
                            >
                              <Link href={`/es`}>ES</Link>
                            </li>
                            <li
                              onClick={() => onClose()}
                              className={
                                pathname.startsWith('/en')
                                  ? 'font-medium text-black'
                                  : 'hover:text-black'
                              }
                            >
                              <Link href={`/en`}>EN</Link>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>
                </ul>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </ChakraProvider>
      </CacheProvider>
    </div>
  )
}
