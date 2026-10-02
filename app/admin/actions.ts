'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import {
  createAdminSession,
  destroyAdminSession,
  requireAdminSession,
  verifyAdminPassword,
} from '@/lib/admin-auth'

function getString(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

function getRequired(formData: FormData, field: string) {
  const value = getString(formData, field)
  if (!value) throw new Error(`Field "${field}" wajib diisi.`)
  return value
}

function getOptional(formData: FormData, field: string) {
  return getString(formData, field) || null
}

function getOptionalUrl(formData: FormData, field: string) {
  const value = getOptional(formData, field)
  if (!value) return null

  let parsedUrl: URL
  try {
    parsedUrl = new URL(value)
  } catch {
    throw new Error(`Field "${field}" harus berisi URL yang valid.`)
  }

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new Error(`Field "${field}" hanya boleh menggunakan HTTP atau HTTPS.`)
  }

  return parsedUrl.toString()
}

function getRequiredUrl(formData: FormData, field: string) {
  const value = getOptionalUrl(formData, field)
  if (!value) throw new Error(`Field "${field}" wajib diisi dengan URL yang valid.`)
  return value
}

function getOrder(formData: FormData) {
  const order = Number(getString(formData, 'order') || '0')
  if (!Number.isInteger(order)) throw new Error('Urutan harus berupa bilangan bulat.')
  return order
}

function getCheckbox(formData: FormData, field: string) {
  return formData.get(field) === 'on'
}

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password')
  if (typeof password !== 'string') redirect('/admin?error=login')
  if (!verifyAdminPassword(password)) redirect('/admin?error=login')

  await createAdminSession()
  redirect('/admin')
}

export async function logoutAdmin() {
  await destroyAdminSession()
  redirect('/admin')
}

export async function saveAdminRecord(formData: FormData) {
  await requireAdminSession()

  const entity = getString(formData, 'entity')
  const id = getString(formData, 'id')

  switch (entity) {
    case 'settings': {
      const data = {
        siteName: getRequired(formData, 'siteName'),
        tagline: getOptional(formData, 'tagline'),
        logoUrl: getOptionalUrl(formData, 'logoUrl'),
        faviconUrl: getOptionalUrl(formData, 'faviconUrl'),
        heroTitle: getRequired(formData, 'heroTitle'),
        heroSubtitle: getRequired(formData, 'heroSubtitle'),
        heroMediaUrl: getOptionalUrl(formData, 'heroMediaUrl'),
        heroMediaType: getRequired(formData, 'heroMediaType'),
        footerText: getOptional(formData, 'footerText'),
        contactEmail: getRequired(formData, 'contactEmail'),
        contactPhone: getRequired(formData, 'contactPhone'),
        contactAddress: getRequired(formData, 'contactAddress'),
      }

      await prisma.siteSetting.upsert({
        where: { id: 'global_setting' },
        update: data,
        create: { id: 'global_setting', ...data },
      })
      break
    }
    case 'menu': {
      const data = {
        title: getRequired(formData, 'title'),
        url: getRequired(formData, 'url'),
        order: getOrder(formData),
        isActive: getCheckbox(formData, 'isActive'),
      }

      if (id) await prisma.menuItem.update({ where: { id }, data })
      else await prisma.menuItem.create({ data })
      break
    }
    case 'service': {
      const data = {
        title: getRequired(formData, 'title'),
        slug: getRequired(formData, 'slug'),
        icon: getOptional(formData, 'icon'),
        shortDesc: getRequired(formData, 'shortDesc'),
        fullDesc: getRequired(formData, 'fullDesc'),
        imageUrl: getOptionalUrl(formData, 'imageUrl'),
        isFeatured: getCheckbox(formData, 'isFeatured'),
        order: getOrder(formData),
      }

      if (id) await prisma.service.update({ where: { id }, data })
      else await prisma.service.create({ data })
      break
    }
    case 'portfolio': {
      const data = {
        title: getRequired(formData, 'title'),
        slug: getRequired(formData, 'slug'),
        client: getRequired(formData, 'client'),
        category: getRequired(formData, 'category'),
        description: getRequired(formData, 'description'),
        coverUrl: getRequiredUrl(formData, 'coverUrl'),
        videoUrl: getOptionalUrl(formData, 'videoUrl'),
        projectUrl: getOptionalUrl(formData, 'projectUrl'),
        isFeatured: getCheckbox(formData, 'isFeatured'),
        order: getOrder(formData),
      }

      if (id) await prisma.portfolio.update({ where: { id }, data })
      else await prisma.portfolio.create({ data })
      break
    }
    case 'testimonial': {
      const rating = Number(getString(formData, 'rating') || '5')
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating harus berupa angka antara 1 dan 5.')
      }

      const data = {
        clientName: getRequired(formData, 'clientName'),
        position: getRequired(formData, 'position'),
        company: getOptional(formData, 'company'),
        avatarUrl: getOptionalUrl(formData, 'avatarUrl'),
        rating,
        content: getRequired(formData, 'content'),
        isFeatured: getCheckbox(formData, 'isFeatured'),
        order: getOrder(formData),
      }

      if (id) await prisma.testimonial.update({ where: { id }, data })
      else await prisma.testimonial.create({ data })
      break
    }
    default:
      throw new Error('Jenis konten admin tidak dikenal.')
  }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin?notice=saved')
}

export async function deleteAdminRecord(formData: FormData) {
  await requireAdminSession()

  const entity = getString(formData, 'entity')
  const id = getRequired(formData, 'id')

  switch (entity) {
    case 'menu':
      await prisma.menuItem.delete({ where: { id } })
      break
    case 'service':
      await prisma.service.delete({ where: { id } })
      break
    case 'portfolio':
      await prisma.portfolio.delete({ where: { id } })
      break
    case 'testimonial':
      await prisma.testimonial.delete({ where: { id } })
      break
    case 'message':
      await prisma.contactMessage.delete({ where: { id } })
      break
    default:
      throw new Error('Jenis konten tidak dapat dihapus.')
  }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin?notice=deleted')
}

export async function setMessageRead(formData: FormData) {
  await requireAdminSession()

  const id = getRequired(formData, 'id')
  const isRead = getString(formData, 'isRead') === 'true'
  await prisma.contactMessage.update({ where: { id }, data: { isRead } })

  revalidatePath('/admin')
  redirect('/admin?notice=updated')
}
