import Link from 'next/link'
import { getSiteSettings } from '@/lib/data'
import { Terminal, Mail, Phone, MapPin } from 'lucide-react'

export default async function Footer() {
  const siteSettings = await getSiteSettings()

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Terminal className="h-5 w-5" />
              </div>
              <span>{siteSettings?.siteName || 'Company Profile'}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {siteSettings?.heroSubtitle || 'Mitra terpercaya untuk solusi IT, Software Development, dan Infrastruktur Cloud.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Informasi Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-400" />
                <span>{siteSettings?.contactAddress || 'Jakarta, Indonesia'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-blue-400" />
                <span>{siteSettings?.contactPhone || '+62 812 3456 7890'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-blue-400" />
                <span>{siteSettings?.contactEmail || 'contact@nexatech.id'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Navigasi Quick Link</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#hero" className="transition-colors hover:text-blue-400">Beranda</Link>
              </li>
              <li>
                <Link href="#services" className="transition-colors hover:text-blue-400">Layanan</Link>
              </li>
              <li>
                <Link href="#contact" className="transition-colors hover:text-blue-400">Hubungi Kami</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900 pt-8 text-center text-xs text-slate-500">
          <p>{siteSettings?.footerText || `© ${new Date().getFullYear()} IT Company Profile. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  )
}