'use client'

import { useState, useTransition } from 'react'
import { submitContactForm } from '@/app/actions/contact'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formElement = event.currentTarget

    startTransition(async () => {
      const res = await submitContactForm(null, formData)
      setStatus(res)
      if (res.success) {
        formElement.reset()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
      {status && (
        <div
          className={`flex items-center gap-3 rounded-lg p-4 text-sm ${
            status.success
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border border-rose-500/30 bg-rose-500/10 text-rose-400'
          }`}
        >
          {status.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Nama Lengkap *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Email *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="nama@email.com"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Nomor Telepon</label>
          <input
            type="tel"
            name="phone"
            placeholder="+62 812 3456 7890"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Subjek *</label>
          <input
            type="text"
            name="subject"
            required
            placeholder="Konsultasi Proyek IT"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Pesan *</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Jelaskan kebutuhan software atau infrastruktur bisnis Anda..."
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Mengirim Pesan...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Kirim Pesan
          </>
        )}
      </button>
    </form>
  )
}