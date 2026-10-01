import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Akun Admin Utama
  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@company.com',
      password: 'adminpassword123', // Nanti bisa di-hash menggunakan bcrypt
      role: 'ADMIN',
    },
  })

  // 2. Pengaturan Situs Global
  await prisma.siteSetting.upsert({
    where: { id: 'global_setting' },
    update: {},
    create: {
      id: 'global_setting',
      siteName: 'NexaTech Innovations',
      tagline: 'Transformasi Digital Berkelanjutan',
      heroTitle: 'Membangun Arsitektur Digital Masa Depan',
      heroSubtitle: 'Kami menyediakan solusi IT kelas dunia, Software Custom, Cloud, dan Keamanan Siber untuk mengakselerasi bisnis Anda.',
      contactEmail: 'contact@nexatech.id',
      contactPhone: '+62 812 9988 7766',
      contactAddress: 'Gedung Cyber 2, Lt. 15, Jakarta Selatan',
    },
  })

  // 3. Menu Navigasi
  const menus = [
    { title: 'Beranda', url: '#hero', order: 1 },
    { title: 'Layanan', url: '#services', order: 2 },
    { title: 'Portofolio', url: '#portfolio', order: 3 },
    { title: 'Testimoni', url: '#testimonials', order: 4 },
    { title: 'Kontak', url: '#contact', order: 5 },
  ]

  for (const menu of menus) {
    await prisma.menuItem.create({ data: menu })
  }

  // 4. Layanan Sampel
  const services = [
    {
      title: 'Custom Software Development',
      slug: 'custom-software-development',
      icon: 'Code2',
      shortDesc: 'Pengembangan aplikasi web dan mobile enterprise yang scalable.',
      fullDesc: 'Kami membangun sistem perangkat lunak yang disesuaikan secara presisi dengan kebutuhan alur kerja bisnis Anda, dari arsitektur backend hingga UX modern.',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Cloud Infrastructure & DevOps',
      slug: 'cloud-infrastructure-devops',
      icon: 'Cloud',
      shortDesc: 'Migrasi, optimasi, dan automasi infrastruktur server cloud.',
      fullDesc: 'Layanan konsultasi dan tata kelola cloud AWS/GCP/Azure untuk memastikan uptime tinggi, efisiensi biaya, dan alur CI/CD yang seamless.',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Cyber Security Assessment',
      slug: 'cyber-security-assessment',
      icon: 'ShieldCheck',
      shortDesc: 'Audit keamanan sistem dan penetration testing secara menyeluruh.',
      fullDesc: 'Melindungi aset digital bisnis Anda dari ancaman siber dengan pengujian penetrasi teruji, audit standar ISO 27001, dan perbaikan celah keamanan.',
      isFeatured: true,
      order: 3,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }

  console.log('✅ Seeding berhasil! Data awal telah dibuat.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })