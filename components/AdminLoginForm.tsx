import { loginAdmin } from '@/app/admin/actions'

export default function AdminLoginForm() {
  return (
    <form action={loginAdmin} className="mt-8 space-y-5">
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-300">
          Kata sandi admin
        </label>
        <input
          id="admin-password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
      >
        Masuk ke dashboard
      </button>
    </form>
  )
}
