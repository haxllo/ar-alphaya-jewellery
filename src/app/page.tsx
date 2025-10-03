import Image from "next/image";
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/lib/cms'
import FeaturedProducts from './FeaturedProducts'

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const productsAll = await getProducts()
  const products = productsAll
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 8)
  const curatedCollections = [
    {
      title: 'Heritage Rings',
      copy: 'Hand-set sapphires & diamonds with modern proportions.',
      href: '/collections/rings',
    },
    {
      title: 'Sculpted Earrings',
      copy: 'Architectural silhouettes crafted for luminous movement.',
      href: '/collections/earrings',
    },
    {
      title: 'Custom Atelier',
      copy: 'Co-create bespoke pieces tailored to your story.',
      href: '/contact',
    },
  ]
  const hallmarks = [
    'Ethically sourced gemstones',
    'Handcrafted in Sri Lanka',
    'Lifetime aftercare',
  ]
  return (
    <div className="min-h-screen space-y-24 pb-24 pt-10">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="relative z-10 space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-nocturne-500 backdrop-blur">
              Bespoke Jewellery Atelier
            </p>
            <h1 className="font-serif text-4xl leading-tight text-nocturne-900 sm:text-5xl lg:text-6xl">
              Heirloom-worthy pieces handcrafted for luminous moments.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-nocturne-600">
              AR Alphaya Jewellery celebrates the artistry of precious gemstones and the stories they carry. From intimate proposals to personal milestones, our atelier crafts modern classics designed to be treasured for generations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-nocturne-900"
                href="/collections/rings"
              >
                Shop The Latest
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-nocturne-200 px-8 py-3 text-sm font-semibold tracking-[0.25em] text-nocturne-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-nocturne-400"
                href="/contact"
              >
                Book A Consultation
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-nocturne-500">
              {hallmarks.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gold-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[360px] overflow-hidden rounded-3xl bg-nocturne-900/90 shadow-luxe sm:h-[420px]">
            <Image
              src="/images/auth0bg.png"
              alt="Crafted jewellery"
              fill
              priority
              className="object-cover opacity-90 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-hero-linear" />
            <div className="absolute inset-0 flex flex-col justify-end gap-4 p-8 text-white/90">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">THE ATELIER</p>
              <p className="max-w-xs text-sm leading-relaxed">
                Each piece is sketched, rendered, and hand-set by our master goldsmiths in Kandy, Sri Lanka. We limit monthly commissions to preserve impeccable craftsmanship.
              </p>
              <Link href="/about" className="text-sm font-semibold text-white underline-offset-8 hover:underline">
                Discover our process
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Signature Edits</p>
            <h2 className="mt-2 font-serif text-3xl text-nocturne-900 md:text-4xl">Curated collections for every chapter</h2>
          </div>
          <Link href="/collections/rings" className="text-sm font-semibold text-nocturne-600 underline-offset-6 hover:text-foreground hover:underline">
            View all collections
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {curatedCollections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className="group relative overflow-hidden rounded-2xl border border-nocturne-100 bg-white/80 p-8 shadow-subtle transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-gold-200/80 hover:shadow-luxe"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-gold-100/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex h-full flex-col justify-between gap-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.35em] text-nocturne-400">Collection</span>
                  <h3 className="mt-3 font-serif text-2xl text-nocturne-900">{collection.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-nocturne-600">{collection.copy}</p>
                </div>
                <span className="text-sm font-semibold text-nocturne-700 underline-offset-8 group-hover:underline">Explore now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 rounded-3xl bg-white/80 p-8 shadow-subtle lg:grid-cols-[1.05fr_0.95fr] lg:p-14">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">The Maison</p>
            <h2 className="font-serif text-3xl text-nocturne-900 md:text-4xl">Gemstones with provenance, designs with soul.</h2>
            <p className="text-base leading-relaxed text-nocturne-600">
              We travel directly to ethical mines to source Ceylon sapphires and exceptional gemstones. Our artisans see beauty in restraint—balancing sculptural metalwork with gemstones that appear to float against the skin.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[{ label: 'Lifetime service', value: 'Complimentary' }, { label: 'Average lead time', value: '4–6 weeks' }, { label: 'Global shipping', value: 'Doorstep insured' }].map((item) => (
                <div key={item.label} className="rounded-2xl border border-nocturne-100 bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-nocturne-400">{item.label}</p>
                  <p className="mt-2 font-serif text-xl text-nocturne-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-nocturne-100">
            <Image
              src="/images/LOGO2.png"
              alt="Jewellery atelier"
              fill
              className="object-contain object-center p-6"
            />
          </div>
        </div>
      </section>

      <FeaturedProducts products={products} />

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 rounded-3xl bg-nocturne-900 p-10 text-white/90 shadow-luxe lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Client Notes</p>
            <h2 className="font-serif text-3xl md:text-4xl">“From the first sketch to the unveiling, the AR Alphaya team made our engagement ring feel like a work of art.”</h2>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Anuradha & Dilshan • Colombo</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[{
              title: 'Virtual or in-person consultations',
              copy: 'Meet our designers via video or at the atelier. We explore inspiration, stones, and silhouettes suited to your lifestyle.',
            }, {
              title: '3D renderings & wax previews',
              copy: 'Review scaled renderings and resin casts prior to casting in precious metals—so every angle feels perfect.',
            }].map((card) => (
              <div key={card.title} className="rounded-3xl border border-white/15 bg-white/5 p-6 transition-all duration-500 hover:border-white/35">
                <h3 className="font-serif text-xl text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
