'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// 1. Tambahkan baris ini tepat di bawah import
export const dynamic = 'force-dynamic'

// 2. Pembersihan URL agar aman saat build
const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseUrl = rawUrl.startsWith('http') 
  ? rawUrl 
  : 'https://tnragjugvypouklsejzp.supabase.co'

const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
const supabaseAnonKey = rawKey.length > 20 
  ? rawKey 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucmFnanVndnlwb3VrbHNlanpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NTMzMDAsImV4cCI6MjEwNjQyOTMwMH0.777F8SbTSD-jolOABLDi2x15VOmcLCAuMmq1dCtRrbk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Kata sandi default admin (dapat disesuaikan)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cek apakah admin sudah login sebelumnya di sesi browser ini
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('admin_authenticated')
    if (loggedIn === 'true') {
      setIsAuthenticated(true)
      fetchMessages()
    } else {
      setLoading(false)
    }
  }, [])

  // Fungsi penanganan login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      setPasswordError(false)
      fetchMessages()
    } else {
      setPasswordError(true)
    }
  }

  // Fungsi logout
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setPasswordInput('')
  }

  // Fungsi untuk mengambil data pesan dari Supabase
  const fetchMessages = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  // Fungsi untuk menghapus pesan
  const handleDelete = async (id: string | number) => {
    const confirmed = confirm('Apakah Anda yakin ingin menghapus pesan ini?')
    if (!confirmed) return

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Gagal menghapus pesan: ' + error.message)
    } else {
      setMessages(messages.filter((msg) => msg.id !== id))
    }
  }

  // TAMPILAN 1: Halaman Login (Jika belum terautentikasi)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1">Akses Admin</h1>
            <p className="text-slate-400 text-sm">Masukkan kata sandi untuk mengelola pesan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">
                Kata Sandi Admin
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {passwordError && (
              <p className="text-red-400 text-sm">Kata sandi salah. Silakan coba lagi.</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-slate-400 hover:text-white transition">
              ← Kembali ke Website
            </a>
          </div>
        </div>
      </div>
    )
  }

  // TAMPILAN 2: Halaman Utama Dashboard Admin
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            <p className="text-slate-400 text-sm">Kelola dan hapus pesan masuk dari calon klien</p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={fetchMessages}
              className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition"
            >
              🔒 Logout
            </button>
            <a
              href="/"
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
            >
              ← Kembali ke Website
            </a>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            Gagal mengambil data pesan: {error}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Pesan Masuk ({messages.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 animate-pulse">
              Memuat data pesan dari database...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Belum ada pesan masuk dari formulir kontak.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {messages.map((item) => (
                <div key={item.id} className="p-6 hover:bg-slate-800/50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-200">{item.name || 'Tanpa Nama'}</h3>
                      <p className="text-sm text-blue-400">{item.email}</p>
                      {item.subject && (
                        <p className="text-xs text-slate-400 mt-1">Subjek: {item.subject}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString('id-ID')
                          : '-'}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mt-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}