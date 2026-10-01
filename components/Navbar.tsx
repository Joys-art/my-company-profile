import Link from 'next/link'
import { getMenuItems, getSiteSettings } from '@/lib/data'
import { Terminal } from 'lucide-react'

export default async function Navbar() {
  const siteSettings = await getSiteSettings()
  const menuItems = await getMenuItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <Terminal className="h-5 w-5" />
          </div>
          <span>{siteSettings?.siteName || 'Company Profile'}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <Link
          href="#contact"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
        >
          Hubungi Kami
        </Link>
      </div>
    </header>
  )
}