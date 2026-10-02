import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const cookieName = 'admin_session'
const sessionDurationSeconds = 60 * 60 * 8

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) return null
  return secret
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 16 && getSessionSecret())
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function verifyAdminPassword(input: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD
  if (!configuredPassword || configuredPassword.length < 16) return false

  const inputHash = createHash('sha256').update(input).digest()
  const passwordHash = createHash('sha256').update(configuredPassword).digest()
  return timingSafeEqual(inputHash, passwordHash)
}

export async function createAdminSession() {
  const secret = getSessionSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters.')

  const expiresAt = Math.floor(Date.now() / 1000) + sessionDurationSeconds
  const payload = String(expiresAt)
  const cookieStore = await cookies()

  cookieStore.set(cookieName, `${payload}.${sign(payload, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: sessionDurationSeconds,
  })
}

export async function isAdminAuthenticated() {
  const secret = getSessionSecret()
  if (!secret || !process.env.ADMIN_PASSWORD) return false

  const cookieStore = await cookies()
  const token = cookieStore.get(cookieName)?.value
  if (!token) return false

  const [payload, signature, ...extra] = token.split('.')
  if (!payload || !signature || extra.length > 0) return false

  const expiresAt = Number(payload)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false

  const expected = Buffer.from(sign(payload, secret), 'hex')
  const actual = Buffer.from(signature, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function requireAdminSession() {
  if (!(await isAdminAuthenticated())) redirect('/admin')
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: 0,
  })
}
