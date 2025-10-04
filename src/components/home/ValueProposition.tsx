export default function ValueProposition() {
  const values = [
    {
      title: 'Handcrafted, not factory-made',
      description: 'Every piece is created start-to-finish by a single artisan at my bench in Kandy—no mass production, just careful attention to your unique design.',
    },
    {
      title: 'Personal support, not generic service',
      description: 'Work directly with me through every stage. No middlemen, no confusion—just clear communication and collaborative refinement.',
    },
    {
      title: 'Locally sourced stones',
      description: 'Sri Lankan sapphires and coloured gemstones selected from trusted local dealers, bringing you exceptional quality without international markup.',
    },
    {
      title: 'Accessible prices for custom work',
      description: 'Bespoke doesn\'t mean expensive. Most custom commissions cost the same or less than ready-made pieces from major retailers.',
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-3xl border border-gold-200/60 bg-gradient-to-br from-gold-50/80 to-white/80 p-10 shadow-luxe">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Our Promise</p>
          <h2 className="mt-3 font-serif text-3xl text-nocturne-900 md:text-4xl">
            Why choose AR Alphaya?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-nocturne-600">
            I believe everyone deserves meaningful, bespoke jewellery—without luxury prices.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border border-nocturne-100 bg-white/70 p-8 shadow-subtle transition-all duration-300 hover:shadow-luxe"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-gold-400" />
                <div>
                  <h3 className="font-serif text-xl text-nocturne-900">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-nocturne-600">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-gold-300/70 bg-white/80 p-8 text-center">
          <p className="font-serif text-2xl text-nocturne-900">
            Free no-pressure design call for all budgets
          </p>
          <p className="mt-3 text-sm leading-relaxed text-nocturne-600">
            Just tell us your dream and budget—we'll work with you to create something beautiful within your means.
          </p>
        </div>
      </div>
    </section>
  )
}
