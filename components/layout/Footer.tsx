import { HomeDictionary } from '@/models/dictionary'

interface FooterProps {
  dictionary: HomeDictionary
}

export default function Footer({ dictionary }: FooterProps) {
  return (
    <div className="mt-auto">
      <div className="text-medium mt-8 flex h-8 w-full  items-center justify-center gap-2 bg-zinc-700 text-center text-xs text-white">
        <p>{dictionary.footerText}</p>
      </div>
    </div>
  )
}
