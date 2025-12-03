import Image from "next/image";
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/lib/cms'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import DynamicHeroImage from '@/components/home/DynamicHeroImage'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SectionDivider } from '@/components/ui/divider'
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
      answer: 'Custom pieces typically require 4–6 weeks from design approval to completion, plus 2–4 business days for domestic delivery. Complex stone sourcing, engraving, or international shipping may extend this timeline.',
    },
    {
      question: 'Can you resize or refresh older pieces?',
      answer: 'Where construction allows, I can resize, repair, or modernise existing jewellery. Share photos via email to confirm feasibility before we schedule a drop-off.',
    },
  ]
  return (
    <div className="min-h-screen space-y-32 md:space-y-40 pb-40 bg-neutral-soft">
      {/* Hero Section - Minimal */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/auth0bg.png"
            alt="Bespoke jewellery"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-hero-linear" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-8 py-24 text-center">
          <p className="inline-block text-sm uppercase tracking-wider text-metal-gold mb-8">
            Bespoke Jewellery Atelier
          </p>
          <h1 className="font-serif font-medium text-5xl md:text-6xl lg:text-7xl leading-tight text-white max-w-4xl mx-auto tracking-tight mb-10">
            Bespoke jewellery at everyday prices
          </h1>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-14">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-deep-black px-8 py-4 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep"
              href="/collections/rings"
            >
              Browse Jewellery
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full bg-forest-deep px-8 py-4 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep-light"
              href="/contact"
            >
              Custom Design
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - MOVED UP */}
      <FeaturedProducts products={products} />

      <SectionDivider />

      {/* Value Props - 3 Column */}
      <section className="mx-auto max-w-7xl px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="text-center space-y-5 p-10">
            <h3 className="font-serif font-medium text-2xl text-deep-black">Handcrafted</h3>
            <p className="text-sm text-deep-black/70 leading-relaxed">
              Every piece shaped by hand in Kandy, Sri Lanka
            </p>
          </div>
          <div className="text-center space-y-5 p-10 border-x border-metal-gold/20">
            <h3 className="font-serif font-medium text-2xl text-deep-black">Sri Lankan Gems</h3>
            <p className="text-sm text-deep-black/70 leading-relaxed">
              Ethically sourced coloured gemstones from local suppliers
            </p>
          </div>
          <div className="text-center space-y-5 p-10">
            <h3 className="font-serif font-medium text-2xl text-deep-black">Affordable Custom</h3>
            <p className="text-sm text-deep-black/70 leading-relaxed">
              Bespoke quality without luxury markup
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Process Section - Compact */}
      <section id="process" className="mx-auto max-w-7xl px-8 scroll-mt-24">
        <div className="text-center space-y-4 mb-16">
          <p className="text-xs uppercase tracking-wider text-deep-black/60">Custom Process</p>
          <h2 className="font-serif font-normal text-4xl text-deep-black">Four steps to your piece</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step.title} className="space-y-5 p-6">
              <span className="text-5xl font-serif text-metal-gold/40">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-serif font-medium text-xl text-deep-black">{step.title}</h3>
              <p className="text-sm leading-relaxed text-deep-black/70">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-deep-black px-10 py-4 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep">
            Start Your Commission
          </Link>
        </div>
      </section>

      <SectionDivider />

      <section id="faq" className="mx-auto max-w-7xl px-8 scroll-mt-24">
        <div className="text-center space-y-4 mb-16">
          <p className="text-xs uppercase tracking-wider text-deep-black/60">FAQ</p>
          <h2 className="font-serif font-normal text-4xl text-deep-black">Common Questions</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-deep-black-500">FAQ</p>
            <h2 className="font-serif text-3xl text-deep-black-900 md:text-4xl">Answers to the questions I’m asked most</h2>
            <p className="text-sm leading-relaxed text-deep-black-600">
              Every project starts with clarity. If you need details beyond what’s here, send a message and I’ll respond within two business days.
            </p>
            <Link href="/contact" className="inline-flex w-full sm:w-fit items-center justify-center rounded-full bg-foreground px-6 sm:px-7 py-3 text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.28em] text-white transition-all duration-300 hover:-translate-y-0.5">
              Ask a question
            </Link>
          </div>
          <div className="space-y-4">
            {faqs.slice(0, 4).map((faq) => (
              <div key={faq.question} className="p-8 space-y-4 bg-white/80 border border-metal-gold/20 rounded-2xl shadow-subtle hover:border-metal-gold/40 hover:shadow-luxe transition-all duration-300">
                <h3 className="text-base font-semibold text-deep-black">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-deep-black/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Commission Process CTA */}
      <section className="mx-auto max-w-7xl px-8">
        <div className="grid gap-10 rounded-2xl bg-forest-deep p-10 lg:p-16 text-white/90 shadow-luxe lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-wider text-metal-gold-light">Personal Process</p>
            <h2 className="font-serif font-normal text-3xl lg:text-4xl text-white leading-tight">From first chat to final polish, we keep the process personal.</h2>
            <p className="text-sm text-white/60">Here’s how a typical commission unfolds</p>
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
              <div key={card.title} className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-metal-gold/30 hover:bg-white/10">
                <h3 className="font-serif text-lg text-white mb-3">{card.title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}




