import prisma from '@/lib/prisma'

export async function getSiteSettings() {
  try {
    return await prisma.siteSetting.findUnique({
      where: { id: 'global_setting' },
    })
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return null
  }
}

export async function getMenuItems() {
  try {
    return await prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Failed to fetch menu items:', error)
    return []
  }
}

export async function getServices() {
  try {
    return await prisma.service.findMany({
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return []
  }
}

export async function getPortfolios() {
  try {
    return await prisma.portfolio.findMany({
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Failed to fetch portfolio projects:', error)
    return []
  }
}

export async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}