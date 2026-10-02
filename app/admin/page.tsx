import Link from 'next/link'
import AdminDashboard from '@/components/AdminDashboard'
import AdminLoginForm from '@/components/AdminLoginForm'
import prisma from '@/lib/prisma'
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth'

type AdminPageProps = {
  searchParams: Promise<{ error?: string; notice?: string }>
}

type AdminValue = string | number | boolean | null
type AdminRecord = Record<string, AdminValue>

function toAdminRecord(record: object): AdminRecord {
  const result: AdminRecord = {}
  const values = record as Record<string, unknown>

  for (const key of Object.keys(values)) {
    const value = values[key]
    if (value instanceof Date) result[key] = value.toISOString()
    else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      result[key] = value
    }
  }

  return result
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams
  const configured = isAdminConfigured()

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-slate-900 p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Konfigurasi diperlukan</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Siapkan akses admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Dashboard dikunci sampai kredensial server disiapkan. Atur <code className="text-amber-200">ADMIN_PASSWORD</code> (minimal 16 karakter) dan
            {' '}<code className="text-amber-200">ADMIN_SESSION_SECRET</code> (minimal 32 karakter), lalu mulai ulang aplikasi.
          </p>
        </div>
      </div>
    )
  }

  if (!(await isAdminAuthenticated())) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Area terbatas</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Masuk ke dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">Gunakan kata sandi admin untuk mengelola isi situs.</p>
          {params.error === 'login' && (
            <p role="alert" className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-300">
              Kata sandi salah. Silakan coba lagi.
            </p>
          )}
          <AdminLoginForm />
          <Link href="/" className="mt-6 block text-center text-sm text-slate-500 transition hover:text-white">
            Kembali ke situs
          </Link>
        </div>
      </div>
    )
  }

  const [settings, menus, services, portfolios, testimonials, messages] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 'global_setting' } }),
    prisma.menuItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.portfolio.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  const settingsData = settings
    ? toAdminRecord(settings)
    : {
        id: 'global_setting',
        siteName: '',
        tagline: '',
        logoUrl: '',
        faviconUrl: '',
        heroTitle: '',
        heroSubtitle: '',
        heroMediaUrl: '',
        heroMediaType: 'IMAGE',
        footerText: '',
        contactEmail: '',
        contactPhone: '',
        contactAddress: '',
      }

  return (
    <AdminDashboard
      data={{
        settings: settingsData,
        menus: menus.map(toAdminRecord),
        services: services.map(toAdminRecord),
        portfolios: portfolios.map(toAdminRecord),
        testimonials: testimonials.map(toAdminRecord),
        messages: messages.map(toAdminRecord),
      }}
      notice={params.notice}
    />
  )
}
