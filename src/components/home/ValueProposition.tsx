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
      <div className="rounded-2xl border border-metal-gold/20 bg-gradient-to-br from-metal-gold/5 to-white/80 p-10 shadow-luxe">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-wider text-deep-black/60">Our Promise</p>
          <h2 className="mt-3 font-serif font-normal text-3xl text-deep-black md:text-4xl">
            Why choose AR Alphaya?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-deep-black/70">
            I believe everyone deserves meaningful, bespoke jewellery—without luxury prices.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-metal-gold/20 bg-white/70 p-8 shadow-subtle transition-all duration-300 hover:shadow-luxe"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-metal-gold" />
                <div>
                  <h3 className="font-serif font-normal text-xl text-deep-black">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-deep-black/70">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-metal-gold/30 bg-white/80 p-8 text-center">
          <p className="font-serif font-normal text-2xl text-deep-black">
            Free no-pressure design call for all budgets
          </p>
          <p className="mt-3 text-sm leading-relaxed text-deep-black/70">
            Just tell us your dream and budget—we'll work with you to create something beautiful within your means.
          </p>
        </div>
      </div>
    </section>
  )
}
