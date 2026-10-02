'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteAdminRecord, logoutAdmin, saveAdminRecord, setMessageRead } from '@/app/admin/actions'

type AdminValue = string | number | boolean | null
type AdminRecord = Record<string, AdminValue>
type FieldType = 'text' | 'url' | 'email' | 'tel' | 'number' | 'textarea' | 'checkbox' | 'select'

type Field = {
  name: string
  label: string
  type?: FieldType
  required?: boolean
  options?: string[]
  placeholder?: string
}

type AdminData = {
  settings: AdminRecord
  menus: AdminRecord[]
  services: AdminRecord[]
  portfolios: AdminRecord[]
  testimonials: AdminRecord[]
  messages: AdminRecord[]
}

const sections: Array<{ id: keyof AdminData; title: string }> = [
  { id: 'settings', title: 'Pengaturan situs' },
  { id: 'menus', title: 'Navigasi' },
  { id: 'services', title: 'Layanan' },
  { id: 'portfolios', title: 'Portofolio' },
  { id: 'testimonials', title: 'Testimoni' },
  { id: 'messages', title: 'Pesan masuk' },
]

const entityBySection = {
  menus: 'menu',
  services: 'service',
  portfolios: 'portfolio',
  testimonials: 'testimonial',
} as const

const fields: Record<Exclude<keyof AdminData, 'messages'>, Field[]> = {
  settings: [
    { name: 'siteName', label: 'Nama situs', required: true },
    { name: 'tagline', label: 'Tagline' },
    { name: 'logoUrl', label: 'URL logo', type: 'url' },
    { name: 'faviconUrl', label: 'URL favicon', type: 'url' },
    { name: 'heroTitle', label: 'Judul utama', required: true },
    { name: 'heroSubtitle', label: 'Deskripsi utama', type: 'textarea', required: true },
    { name: 'heroMediaUrl', label: 'URL media hero', type: 'url' },
    { name: 'heroMediaType', label: 'Jenis media hero', type: 'select', options: ['IMAGE', 'VIDEO'], required: true },
    { name: 'contactEmail', label: 'Email kontak', type: 'email', required: true },
    { name: 'contactPhone', label: 'Telepon / WhatsApp', type: 'tel', required: true },
    { name: 'contactAddress', label: 'Alamat', type: 'textarea', required: true },
    { name: 'footerText', label: 'Teks footer', type: 'textarea' },
  ],
  menus: [
    { name: 'title', label: 'Nama menu', required: true },
    { name: 'url', label: 'URL / anchor (contoh: #services)', required: true },
    { name: 'order', label: 'Urutan', type: 'number' },
    { name: 'isActive', label: 'Tampilkan menu', type: 'checkbox' },
  ],
  services: [
    { name: 'title', label: 'Nama layanan', required: true },
    { name: 'slug', label: 'Slug URL', required: true },
    { name: 'icon', label: 'Nama ikon (Code2, Cloud, ShieldCheck)' },
    { name: 'shortDesc', label: 'Deskripsi singkat', type: 'textarea', required: true },
    { name: 'fullDesc', label: 'Deskripsi lengkap', type: 'textarea', required: true },
    { name: 'imageUrl', label: 'URL gambar', type: 'url' },
    { name: 'isFeatured', label: 'Tandai unggulan', type: 'checkbox' },
    { name: 'order', label: 'Urutan', type: 'number' },
  ],
  portfolios: [
    { name: 'title', label: 'Nama proyek', required: true },
    { name: 'slug', label: 'Slug URL', required: true },
    { name: 'client', label: 'Klien', required: true },
    { name: 'category', label: 'Kategori', required: true },
    { name: 'description', label: 'Deskripsi proyek', type: 'textarea', required: true },
    { name: 'coverUrl', label: 'URL gambar sampul', type: 'url', required: true },
    { name: 'videoUrl', label: 'URL video', type: 'url' },
    { name: 'projectUrl', label: 'URL proyek', type: 'url' },
    { name: 'isFeatured', label: 'Tampilkan sebagai unggulan', type: 'checkbox' },
    { name: 'order', label: 'Urutan', type: 'number' },
  ],
  testimonials: [
    { name: 'clientName', label: 'Nama klien', required: true },
    { name: 'position', label: 'Jabatan', required: true },
    { name: 'company', label: 'Perusahaan' },
    { name: 'avatarUrl', label: 'URL foto', type: 'url' },
    { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
    { name: 'content', label: 'Isi testimoni', type: 'textarea', required: true },
    { name: 'isFeatured', label: 'Tampilkan sebagai unggulan', type: 'checkbox' },
    { name: 'order', label: 'Urutan', type: 'number' },
  ],
}

function displayTitle(record: AdminRecord) {
  return String(record.title ?? record.clientName ?? record.subject ?? record.name ?? record.siteName ?? 'Konten')
}

function AdminField({
  field,
  value,
  id,
}: {
  field: Field
  value?: AdminValue
  id: string
}) {
  const valueString = value === null || value === undefined ? '' : String(value)
  const commonProps = {
    id,
    name: field.name,
    required: field.required,
    className:
      'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  }

  if (field.type === 'checkbox') {
    return (
      <label htmlFor={id} className="flex items-center gap-3 text-sm text-slate-300">
        <input
          id={id}
          name={field.name}
          type="checkbox"
          defaultChecked={value === true}
          className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500"
        />
        {field.label}
      </label>
    )
  }

  return (
    <div className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          {...commonProps}
          rows={3}
          defaultValue={valueString}
          placeholder={field.placeholder}
        />
      ) : field.type === 'select' ? (
        <select {...commonProps} defaultValue={valueString}>
          {field.options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          {...commonProps}
          type={field.type ?? 'text'}
          defaultValue={valueString}
          placeholder={field.placeholder}
        />
      )}
    </div>
  )
}

function RecordForm({
  entity,
  record,
  formKey,
}: {
  entity: Exclude<keyof AdminData, 'messages'>
  record?: AdminRecord
  formKey: string
}) {
  return (
    <form action={saveAdminRecord} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="entity" value={entity === 'settings' ? 'settings' : entity.slice(0, -1)} />
      {record?.id && <input type="hidden" name="id" value={String(record.id)} />}
      {fields[entity].map((field) => (
        <AdminField
          key={`${formKey}-${field.name}`}
          field={field}
          value={record?.[field.name]}
          id={`${formKey}-${field.name}`}
        />
      ))}
      <div className="flex items-end sm:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {record ? 'Simpan perubahan' : 'Tambah konten'}
        </button>
      </div>
    </form>
  )
}

function ContentSection({
  section,
  records,
}: {
  section: Exclude<keyof AdminData, 'messages'>
  records: AdminRecord[]
}) {
  const entity = section === 'settings' ? 'settings' : entityBySection[section]

  return (
    <section id={section} className="scroll-mt-8 rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
        <h2 className="font-semibold text-white">{sections.find((item) => item.id === section)?.title}</h2>
        <p className="mt-1 text-xs text-slate-500">
          {section === 'settings' ? 'Identitas, teks utama, dan informasi kontak situs.' : `${records.length} konten tersimpan.`}
        </p>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        {section === 'settings' ? (
          <RecordForm entity="settings" record={records[0]} formKey="settings" />
        ) : (
          <>
            <details className="group rounded-xl border border-blue-500/25 bg-blue-500/5 p-4">
              <summary className="cursor-pointer list-none font-medium text-blue-300">
                + Tambah {sections.find((item) => item.id === section)?.title.toLowerCase()}
              </summary>
              <div className="pt-5">
                <RecordForm entity={section} formKey={`new-${section}`} />
              </div>
            </details>
            {records.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
                Belum ada konten.
              </p>
            ) : (
              records.map((record) => (
                <details key={String(record.id)} className="rounded-xl border border-slate-800 bg-slate-950/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                    <span className="min-w-0 truncate font-medium text-slate-200">{displayTitle(record)}</span>
                    <span className="shrink-0 text-xs text-slate-500">Edit</span>
                  </summary>
                  <div className="border-t border-slate-800 p-4">
                    <RecordForm entity={section} record={record} formKey={`${section}-${String(record.id)}`} />
                    <form
                      action={deleteAdminRecord}
                      className="mt-4 border-t border-slate-800 pt-4"
                      onSubmit={(event) => {
                        if (!window.confirm('Yakin ingin menghapus konten ini?')) event.preventDefault()
                      }}
                    >
                      <input type="hidden" name="entity" value={entity} />
                      <input type="hidden" name="id" value={String(record.id)} />
                      <button
                        type="submit"
                        className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10"
                      >
                        Hapus konten
                      </button>
                    </form>
                  </div>
                </details>
              ))
            )}
          </>
        )}
      </div>
    </section>
  )
}

function MessagesSection({ records }: { records: AdminRecord[] }) {
  return (
    <section id="messages" className="scroll-mt-8 rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
        <h2 className="font-semibold text-white">Pesan masuk</h2>
        <p className="mt-1 text-xs text-slate-500">{records.length} pesan dari formulir kontak.</p>
      </div>
      {records.length === 0 ? (
        <p className="p-10 text-center text-sm text-slate-500">Belum ada pesan masuk.</p>
      ) : (
        <div className="divide-y divide-slate-800">
          {records.map((record) => (
            <article key={String(record.id)} className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{String(record.name ?? 'Tanpa nama')}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${record.isRead ? 'bg-slate-800 text-slate-400' : 'bg-blue-500/15 text-blue-300'}`}>
                      {record.isRead ? 'DIBACA' : 'BARU'}
                    </span>
                  </div>
                  <a className="mt-1 block text-sm text-blue-300 hover:underline" href={`mailto:${String(record.email ?? '')}`}>
                    {String(record.email ?? '')}
                  </a>
                  {record.phone && <p className="mt-1 text-xs text-slate-500">{String(record.phone)}</p>}
                </div>
                <time className="text-xs text-slate-500">
                  {record.createdAt ? new Date(String(record.createdAt)).toLocaleString('id-ID') : ''}
                </time>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-200">{String(record.subject ?? '')}</p>
              <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300">
                {String(record.message ?? '')}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={String(record.id)} />
                  <input type="hidden" name="isRead" value={record.isRead ? 'false' : 'true'} />
                  <button className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800">
                    Tandai {record.isRead ? 'belum dibaca' : 'sudah dibaca'}
                  </button>
                </form>
                <form
                  action={deleteAdminRecord}
                  onSubmit={(event) => {
                    if (!window.confirm('Yakin ingin menghapus pesan ini?')) event.preventDefault()
                  }}
                >
                  <input type="hidden" name="entity" value="message" />
                  <input type="hidden" name="id" value={String(record.id)} />
                  <button className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300 transition hover:bg-rose-500/10">
                    Hapus pesan
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default function AdminDashboard({
  data,
  notice,
}: {
  data: AdminData
  notice?: string
}) {
  const [activeSection, setActiveSection] = useState<keyof AdminData>('settings')
  const counts: Record<keyof AdminData, number> = {
    settings: 1,
    menus: data.menus.length,
    services: data.services.length,
    portfolios: data.portfolios.length,
    testimonials: data.testimonials.length,
    messages: data.messages.length,
  }
  const contentRecords: AdminRecord[] =
    activeSection === 'settings'
      ? [data.settings]
      : activeSection === 'messages'
        ? []
        : data[activeSection]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Panel pengelola</p>
            <h1 className="mt-1 text-xl font-bold text-white">Dashboard situs</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
              Lihat situs
            </Link>
            <form action={logoutAdmin}>
              <button className="rounded-lg border border-rose-500/30 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900/70 p-3 lg:sticky lg:top-6">
          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Kelola konten</p>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  activeSection === section.id
                    ? 'bg-blue-600/15 font-medium text-blue-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{section.title}</span>
                <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">{counts[section.id]}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-5">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            {sections.slice(1).map((section) => (
              <div key={section.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-500">{section.title}</p>
                <p className="mt-2 text-2xl font-bold text-white">{counts[section.id]}</p>
              </div>
            ))}
          </div>
          {notice && (
            <p role="status" className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {notice === 'deleted' ? 'Konten berhasil dihapus.' : notice === 'updated' ? 'Pesan berhasil diperbarui.' : 'Perubahan berhasil disimpan.'}
            </p>
          )}
          {activeSection === 'messages' ? (
            <MessagesSection records={data.messages} />
          ) : (
            <ContentSection section={activeSection} records={contentRecords} />
          )}
          <p className="px-1 text-xs leading-relaxed text-slate-600">
            Perubahan data tersimpan langsung ke database. Pastikan URL yang dimasukkan benar sebelum menyimpan.
          </p>
        </main>
      </div>
    </div>
  )
}
