import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 bg-neutral-soft">
      <section className="rounded-2xl bg-white/80 p-10 shadow-subtle border border-metal-gold/10">
        <p className="text-xs uppercase tracking-wider text-deep-black/40">Our Maison</p>
        <h1 className="mt-4 font-serif font-normal text-4xl text-deep-black md:text-5xl">The artistry behind AR Alphaya Jewellery</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-deep-black/70">
          AR Alphaya Jewellery is a solo atelier based in Kandy, Sri Lanka. I design, carve, cast, and finish each piece by hand, partnering with local gemstone cutters to showcase the colour and character of Sri Lankan stones in modern, wearable forms. <strong>I believe everyone deserves meaningful, bespoke jewellery—without luxury prices.</strong>
        </p>
      </section>

      {/* Atelier Images - Crossfade Animation */}
      <section className="mt-14">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-deep-black/40">Our Atelier</p>
          <h2 className="mt-2 font-serif font-normal text-2xl text-deep-black">
            Handcrafted in Kandy
          </h2>
        </div>
        
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl border border-metal-gold/10 shadow-luxe">
          {/* Image 1 - Fades in/out */}
          <Image
            src="/images/001.jpg"
            alt="Artisan hands finishing a custom gemstone ring at AR Alphaya atelier in Kandy, Sri Lanka"
            fill
            className="object-cover animate-crossfade"
            sizes="(max-width: 1200px) 100vw, 1200px"
            quality={90}
            priority
          />
          {/* Image 2 - Fades in/out with delay */}
          <Image
            src="/images/002.jpg"
            alt="Jeweler crafting bespoke jewellery at the bench in our Kandy workshop"
            fill
            className="object-cover animate-crossfade-alt"
            sizes="(max-width: 1200px) 100vw, 1200px"
            quality={90}
          />
        </div>
        
        <p className="mt-6 text-center text-sm leading-relaxed text-deep-black/60">
          Every piece hand-finished at our atelier in Kandy, Sri Lanka
        </p>
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10">
          {[{
            title: 'Crafted in-house',
            copy: 'From sketchbook to final polish, every commission is handled from my bench. I carve waxes, cast in recycled gold, and finish each surface by hand to ensure the piece feels personal and comfortable for daily wear.'
          }, {
            title: 'Design distilled to essentials',
            copy: 'Pieces are made to be lived in. Together we refine silhouettes that complement your lifestyle, keeping gemstones protected while inviting light to dance across every facet.'
          }, {
            title: 'Collaborative by nature',
            copy: 'Whether restoring an heirloom or starting from a blank page, you are part of the journey—review sketches, 3D renders, or wax previews before anything is cast in metal.'
          }].map((block) => (
            <div key={block.title} className="space-y-3">
              <h2 className="font-serif font-normal text-3xl text-deep-black">{block.title}</h2>
              <p className="text-base leading-relaxed text-deep-black/70">{block.copy}</p>
            </div>
          ))}
        </div>
        <div className="space-y-6 rounded-2xl border border-metal-gold/10 bg-white/70 p-8 shadow-subtle">
          <h3 className="text-xs uppercase tracking-wider text-deep-black/40">House tenets</h3>
          <ul className="space-y-5 text-sm text-deep-black/70">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-metal-gold" />
              <span>Sri Lankan coloured gemstones sourced directly from trusted cutters and dealers.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-metal-gold" />
              <span>Only a few commissions are taken on at a time so your project always receives full attention.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-metal-gold" />
              <span>Care appointments available in Sri Lanka for cleaning, polishing, and secure stone checks.</span>
            </li>
          </ul>
          <div className="rounded-2xl border border-metal-gold/10 bg-white/60 p-6">
            <p className="text-sm uppercase tracking-wider text-deep-black/40">Atelier Consultations</p>
            <p className="mt-3 text-sm leading-relaxed text-deep-black/70">
              Appointments available in Kandy or via video call. Contact us to arrange a private consultation to discuss your commission.
            </p>
            <a href="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-deep-black underline-offset-6 hover:text-metal-gold hover:underline">
              Book a consultation
            </a>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-metal-gold/10 bg-white/70 p-10 shadow-subtle">
        <h3 className="text-xs uppercase tracking-wider text-deep-black/40">Our promise</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[{ label: 'Average production time', value: '4–6 weeks from design approval, plus delivery' }, { label: 'Aftercare', value: 'Complimentary clean & polish within 6 months of delivery' }, { label: 'Made for you', value: 'Each commission is created one at a time from start to finish' }].map((item) => (
            <div key={item.label} className="rounded-2xl border border-metal-gold/10 bg-white/60 p-6">
              <p className="text-xs uppercase tracking-wider text-deep-black/40">{item.label}</p>
              <p className="mt-3 font-serif font-normal text-xl text-deep-black">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-metal-gold/20 bg-metal-gold/5 p-8 text-deep-black md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-deep-black/40">Ready to begin</p>
            <p className="mt-2 font-serif text-2xl text-deep-black-900">Let’s craft your next chapter</p>
          </div>
          <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-deep-black px-8 py-3 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep">
            Book a consultation
          </a>
        </div>
      </section>
    </div>
  )
}
