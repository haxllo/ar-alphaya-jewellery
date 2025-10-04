export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <section className="rounded-3xl bg-white/80 p-10 shadow-subtle">
        <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Our Maison</p>
        <h1 className="mt-4 font-serif text-4xl text-nocturne-900 md:text-5xl">The artistry behind AR Alphaya Jewellery</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-nocturne-600">
          AR Alphaya Jewellery is a solo atelier based in Kandy, Sri Lanka. I design, carve, cast, and finish each piece by hand, partnering with local gemstone cutters to showcase the colour and character of Sri Lankan stones in modern, wearable forms. <strong>I believe everyone deserves meaningful, bespoke jewellery—without luxury prices.</strong>
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
              <h2 className="font-serif text-3xl text-nocturne-900">{block.title}</h2>
              <p className="text-base leading-relaxed text-nocturne-600">{block.copy}</p>
            </div>
          ))}
        </div>
        <div className="space-y-6 rounded-3xl border border-nocturne-100 bg-white/70 p-8 shadow-subtle">
          <h3 className="text-xs uppercase tracking-[0.3em] text-nocturne-500">House tenets</h3>
          <ul className="space-y-5 text-sm text-nocturne-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gold-400" />
              <span>Sri Lankan coloured gemstones sourced directly from trusted cutters and dealers.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gold-400" />
              <span>Only a few commissions are taken on at a time so your project always receives full attention.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gold-400" />
              <span>Care appointments available in Sri Lanka for cleaning, polishing, and secure stone checks.</span>
            </li>
          </ul>
          <div className="rounded-2xl border border-nocturne-100 bg-white/60 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-nocturne-500">Atelier visits</p>
            <p className="mt-3 text-sm leading-relaxed text-nocturne-600">
              Visit the workshop in Kandy by appointment or schedule a private video consultation if you are based elsewhere.
            </p>
            <a href="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-nocturne-700 underline-offset-6 hover:text-foreground hover:underline">
              Schedule your visit
            </a>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-nocturne-100 bg-white/70 p-10 shadow-subtle">
        <h3 className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Our promise</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[{ label: 'Average lead time', value: '4–6 weeks with check-ins every milestone' }, { label: 'Aftercare', value: 'Complimentary clean & polish within 6 months of delivery' }, { label: 'Made for you', value: 'Each commission is created one at a time from start to finish' }].map((item) => (
            <div key={item.label} className="rounded-3xl border border-nocturne-100 bg-white/60 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-nocturne-500">{item.label}</p>
              <p className="mt-3 font-serif text-xl text-nocturne-900">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-gold-200/60 bg-gold-50/80 p-8 text-nocturne-700 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-nocturne-500">Ready to begin</p>
            <p className="mt-2 font-serif text-2xl text-nocturne-900">Let’s craft your next chapter</p>
          </div>
          <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5">
            Book a consultation
          </a>
        </div>
      </section>
    </div>
  )
}
