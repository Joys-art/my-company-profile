export const dynamic = 'force-dynamic';
import { getPortfolios, getServices, getSiteSettings, getTestimonials } from '@/lib/data'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { ArrowRight, Code2, Cloud, ShieldCheck, CheckCircle2, Mail, Phone, MapPin, Star } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title: settings?.siteName || 'IT Solution & Digital Architecture',
    description: settings?.heroSubtitle || 'Layanan IT Profesional, Software Custom, dan Cloud Infrastructure.',
    icons: settings?.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  }
}

export default async function HomePage() {
  const [siteSettings, services, portfolios, testimonials] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getPortfolios(),
    getTestimonials(),
  ])

  const getIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="h-7 w-7 text-blue-400" />
      case 'Cloud':
        return <Cloud className="h-7 w-7 text-blue-400" />
      case 'ShieldCheck':
        return <ShieldCheck className="h-7 w-7 text-blue-400" />
      default:
        return <Code2 className="h-7 w-7 text-blue-400" />
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden py-24 md:py-32">
        {siteSettings?.heroMediaType === 'VIDEO' && siteSettings.heroMediaUrl && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src={siteSettings.heroMediaUrl} />
          </video>
        )}
        {siteSettings?.heroMediaType === 'IMAGE' && siteSettings.heroMediaUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url("${siteSettings.heroMediaUrl}")` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {siteSettings?.tagline || 'Transformasi Digital Berkelanjutan'}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              {siteSettings?.heroTitle || 'Membangun Arsitektur Digital Masa Depan'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              {siteSettings?.heroSubtitle || 'Kami menyediakan solusi IT kelas dunia.'}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <a
                href="#services"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500"
              >
                Jelajahi Layanan <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="border-t border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Layanan Unggulan Kami</h2>
            <p className="mt-4 text-slate-400">Solusi teknologi end-to-end yang dirancang untuk skala bisnis modern.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  {getIcon(service.icon)}
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{service.shortDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Portofolio Pilihan</h2>
            <p className="mt-4 text-slate-400">Beberapa proyek dan solusi yang telah kami kerjakan.</p>
          </div>
          {portfolios.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
              Portofolio kami sedang diperbarui. Silakan hubungi kami untuk melihat pengalaman proyek.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((project) => (
                <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
                  <div
                    className="flex aspect-[16/9] items-end bg-cover bg-center bg-gradient-to-br from-blue-950 via-slate-900 to-slate-800 p-6"
                    style={{ backgroundImage: `linear-gradient(0deg, rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.05)), url("${project.coverUrl}")` }}
                  >
                    <span className="rounded-full border border-blue-400/20 bg-slate-950/60 px-3 py-1 text-xs font-medium text-blue-300">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{project.client}</p>
                    <h3 className="mt-2 text-lg font-bold text-white">{project.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{project.description}</p>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                      >
                        Lihat proyek <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="testimonials" className="border-t border-slate-800 bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Kata Klien Kami</h2>
            <p className="mt-4 text-slate-400">Pengalaman bekerja bersama tim kami.</p>
          </div>
          {testimonials.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
              Testimoni klien akan segera hadir.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                  <div className="flex gap-1 text-amber-400" aria-label={`Rating ${testimonial.rating} dari 5`}>
                    {Array.from({ length: testimonial.rating }, (_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-sm leading-relaxed text-slate-300">
                    “{testimonial.content}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-slate-800 pt-4">
                    <p className="font-semibold text-white">{testimonial.clientName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {testimonial.position}{testimonial.company ? `, ${testimonial.company}` : ''}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Diskusi Proyek Anda</h2>
              <p className="mt-4 text-slate-400">
                Punya ide proyek atau butuh transformasi sistem digital? Kontak tim ahli kami dan kami akan membalas pesan Anda dalam 24 jam.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Alamat Kantor</h4>
                    <p className="mt-1 text-sm text-slate-400">{siteSettings?.contactAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Email Resmi</h4>
                    <p className="mt-1 text-sm text-slate-400">{siteSettings?.contactEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Telepon / WhatsApp</h4>
                    <p className="mt-1 text-sm text-slate-400">{siteSettings?.contactPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}