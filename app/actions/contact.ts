'use server'

import prisma from '@/lib/prisma'

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !subject || !message) {
      return { success: false, message: 'Harap isi semua kolom wajib!' }
    }

    // Menyimpan pesan langsung ke database Supabase
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    })

    return {
      success: true,
      message: 'Pesan Anda berhasil terkirim! Tim kami akan segera menghubungi Anda.',
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.',
    }
  }
}