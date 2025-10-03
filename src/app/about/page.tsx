export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <section className="rounded-3xl bg-white/80 p-10 shadow-subtle">
        <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Our Maison</p>
        <h1 className="mt-4 font-serif text-4xl text-nocturne-900 md:text-5xl">The artistry behind AR Alphaya Jewellery</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-nocturne-600">
          Founded in 2012, AR Alphaya Jewellery is a family-led atelier rooted in Kandy, Sri Lanka. We transform ethically sourced gemstones into modern heirlooms, blending centuries-old goldsmithing with architectural silhouettes designed for today.
        </p>
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10">
          {[{
            title: 'Crafted in-house',
            copy: 'Every ring, pendant, and bracelet is sketched, rendered, and hand-finished within our atelier. We partner directly with Sri Lankan gem cutters to select stones that meet our calibre for clarity, colour, and character.'
          }, {
            title: 'Design distilled to essentials',
            copy: 'Our pieces are made to be lived in. We refine each curve and setting to sit comfortably against the skin, protecting gemstones while inviting light to dance across every facet.'
          }, {
            title: 'Collaborative by nature',
            copy: 'Whether restoring an heirloom or co-creating a proposal ring, we invite clients into the journey through sketches, 3D renderings, and tactile wax previews before casting in precious metal.'
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
              <span>Ethically mined Ceylon sapphires, traceable diamonds, and recycled precious metals.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gold-400" />
              <span>Limited monthly commissions to ensure meticulous hand-finishing by our master artisans.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gold-400" />
              <span>Lifetime servicing including complimentary cleaning, prong checks, and resizing.</span>
            </li>
          </ul>
          <div className="rounded-2xl border border-nocturne-100 bg-white/60 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-nocturne-500">Atelier visits</p>
            <p className="mt-3 text-sm leading-relaxed text-nocturne-600">
              Experience our gem vault and workshop in Kandy by appointment. We also host private virtual consultations for international clients.
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
          {[{ label: 'Average lead time', value: '4–6 weeks with updates each fortnight' }, { label: 'Aftercare', value: 'Complimentary cleaning & lifetime repair credit' }, { label: 'Global collectors', value: 'Serving clients across 18 countries and counting' }].map((item) => (
            <div key={item.label} className="rounded-3xl border border-nocturne-100 bg-white/60 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-nocturne-500">{item.label}</p>
              <p className="mt-3 font-serif text-xl text-nocturne-900">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-gold-200/60 bg-gold-50/80 p-8 text-nocturne-700 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-nocturne-500">Ready to begin</p>
            <p className="mt-2 font-serif text-2xl text-nocturne-900">Let us craft your next chapter</p>
          </div>
          <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5">
            Book a consultation
          </a>
        </div>
      </section>
    </div>
  )
}
