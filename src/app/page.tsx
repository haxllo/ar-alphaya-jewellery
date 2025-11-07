import Image from "next/image";
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/lib/cms'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import DynamicHeroImage from '@/components/home/DynamicHeroImage'

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
      title: 'Current Creations',
      copy: 'Limited coloured gemstone pieces ready to tailor to your story.',
      href: '/collections/rings',
    },
    {
      title: 'Design Archive',
      copy: 'Past one-of-a-kind commissions to inspire your next request.',
      href: '/collections/earrings',
    },
    {
      title: 'Custom Atelier',
      copy: 'Begin a one-to-one collaboration from sketch to final polish.',
      href: '/contact',
    },
  ]
  const hallmarks = [
    'One-to-one consultations',
    'Handcrafted in Kandy, Sri Lanka',
    'Coloured gemstones & recycled gold (no diamonds)',
  ]
  const processSteps = [
    {
      title: 'Share your story',
      description: 'Send a brief or book a call so we can learn about your occasion, style, and budget. Reference photos are welcome but never required.',
    },
    {
      title: 'Design & refine',
      description: 'Receive sketches and digital renderings to review together. We tweak settings, stone choices, and proportions before locking the design.',
    },
    {
      title: 'Bench work begins',
      description: 'I carve the wax, cast in recycled gold, and hand-set your chosen gemstones. Expect photo or video updates as milestones are reached.',
    },
    {
      title: 'Final polish & delivery',
      description: 'After polishing and quality checks, we arrange a studio pickup or insured delivery within Sri Lanka. International options are quoted on request.',
    },
  ]
  const faqs = [
    {
      question: 'Are your prices premium?',
      answer: 'No! Most custom pieces cost the same or less than ready-made jewellery at major stores. You pay for artisan craftsmanship, not luxury markup. Every project starts with a budget conversation so you feel comfortable from day one.',
    },
    {
      question: 'Do you sell ready-made pieces?',
      answer: 'Yes—limited studio creations are listed here and can be customised. Most clients commission a bespoke design starting from an idea, sketch, or heirloom reset.',
    },
    {
      question: 'What gemstones do you work with?',
      answer: 'I specialise in Sri Lankan sapphires and other coloured gemstones sourced from local dealers. I do not work with diamonds at this time.',
    },
    {
      question: 'How long does a commission take?',
      answer: 'A typical timeline is 4–6 weeks from deposit to delivery. Complex stone sourcing, engraving, or international shipping can add extra time, and I will flag this up front.',
    },
    {
      question: 'Can you resize or refresh older pieces?',
      answer: 'Where construction allows, I can resize, repair, or modernise existing jewellery. Share photos via email to confirm feasibility before we schedule a drop-off.',
    },
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
              Custom jewellery at everyday prices—affordable, personal, and crafted just for you.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-nocturne-600">
              AR Alphaya Jewellery is a one-person studio creating bespoke pieces with Sri Lankan coloured gemstones and recycled gold. Each commission begins with a conversation—together we shape a design that feels true to you. <strong>No luxury markup, just artisan craftsmanship.</strong>
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-nocturne-900"
                href="/contact"
              >
                Get a Quote—No Obligation
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-nocturne-200 px-8 py-3 text-sm font-semibold tracking-[0.25em] text-nocturne-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-nocturne-400"
                href="/collections/rings"
              >
                See Affordable Bespoke Options
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
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">THE STUDIO</p>
              <p className="max-w-xs text-sm leading-relaxed">
                Every design is drafted, cast, and finished by hand at my bench in Kandy. I work on a handful of pieces at a time so you receive obsessive attention at every stage.
              </p>
              <Link href="/about" className="text-sm font-semibold text-white underline-offset-8 hover:underline">
                Learn about the maker
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Current Creations</p>
            <h2 className="mt-2 font-serif text-3xl text-nocturne-900 md:text-4xl">Made-to-order pieces and bespoke inspiration</h2>
          </div>
          <Link href="/collections/rings" className="text-sm font-semibold text-nocturne-600 underline-offset-6 hover:text-foreground hover:underline">
            Browse the studio bench
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
            <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">How we work together</p>
            <h2 className="font-serif text-3xl text-nocturne-900 md:text-4xl">Slow-made jewellery shaped around your story.</h2>
            <p className="text-base leading-relaxed text-nocturne-600">
              I source coloured gemstones from trusted Sri Lankan suppliers and carve every wax, casting, and bezel myself. Designs are refined through sketches, digital renders, and shared checkpoints so you can see each milestone before the final polish.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[{ label: 'Average lead time', value: '4–6 weeks' }, { label: 'Design checkpoints', value: 'Sketch → 3D → Wax' }, { label: 'Support', value: 'Care refresh by appointment' }].map((item) => (
                <div key={item.label} className="rounded-2xl border border-nocturne-100 bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-nocturne-400">{item.label}</p>
                  <p className="mt-2 font-serif text-xl text-nocturne-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-nocturne-100 h-[400px]">`n            <DynamicHeroImage />
          </div>
        </div>
      </section>

      <FeaturedProducts products={products} />

      <section id="process" className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-nocturne-100 bg-white/75 p-8 shadow-subtle lg:p-14">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-nocturne-500">Custom Commissions</p>
              <h2 className="mt-2 font-serif text-3xl text-nocturne-900 md:text-4xl">Four stages from idea to finished piece</h2>
            </div>
            <Link href="/contact" className="text-sm font-semibold text-nocturne-600 underline-offset-6 hover:text-foreground hover:underline">
              Book a consultation
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative overflow-hidden rounded-3xl border border-nocturne-100 bg-white/70 p-6">
                <span className="absolute -top-6 right-8 text-7xl font-serif text-gold-100/80">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-2xl text-nocturne-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-nocturne-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 rounded-3xl bg-white/80 p-8 shadow-subtle lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-nocturne-500">FAQ</p>
            <h2 className="font-serif text-3xl text-nocturne-900 md:text-4xl">Answers to the questions I’m asked most</h2>
            <p className="text-sm leading-relaxed text-nocturne-600">
              Every project starts with clarity. If you need details beyond what’s here, send a message and I’ll respond within two business days.
            </p>
            <Link href="/contact" className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-all duration-300 hover:-translate-y-0.5">
              Ask a question
            </Link>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-nocturne-100 bg-white/70 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-nocturne-500">{faq.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-nocturne-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 rounded-3xl bg-nocturne-900 p-10 text-white/90 shadow-luxe lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Collaboration</p>
            <h2 className="font-serif text-3xl md:text-4xl">From first chat to final polish, we keep the process personal.</h2>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Here’s how a typical commission unfolds</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[{
              title: 'Consult & source',
              copy: 'Chat via video or visit the studio to explore inspiration, budget, and gemstone options tailored to your lifestyle.',
            }, {
              title: 'See it before it’s cast',
              copy: 'Review sketches, renders, and optional wax previews so you can tweak proportions and setting details with confidence.',
            }, {
              title: 'Hand-finishing & delivery',
              copy: 'Your piece is cast, stone-set, and polished by hand. We arrange careful delivery within Sri Lanka or discuss options for abroad.',
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




