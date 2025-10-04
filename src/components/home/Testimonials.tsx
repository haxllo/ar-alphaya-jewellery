export default function Testimonials() {
  const testimonials = [
    {
      quote: "I was shocked at how affordable custom was compared to what I saw in stores. The quality and personal touch made it worth every penny.",
      author: "Sarah M.",
      project: "Custom sapphire engagement ring",
    },
    {
      quote: "Working within my budget, we created exactly what I envisioned. No pressure, just honest guidance and beautiful craftsmanship.",
      author: "James P.",
      project: "Anniversary band redesign",
    },
    {
      quote: "The prices were so reasonable for bespoke work. I got a one-of-a-kind piece for less than ready-made options at luxury brands.",
      author: "Priya S.",
      project: "Heirloom stone reset",
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-3xl bg-white/80 p-10 shadow-subtle">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Client Stories</p>
          <h2 className="mt-3 font-serif text-3xl text-nocturne-900 md:text-4xl">
            Affordable bespoke jewellery that exceeds expectations
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-3xl border border-nocturne-100 bg-white/90 p-8 shadow-subtle"
            >
              <div className="mb-4 flex gap-1 text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm italic leading-relaxed text-nocturne-600">
                "{testimonial.quote}"
              </p>
              <div className="mt-6 border-t border-nocturne-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-nocturne-900">
                  {testimonial.author}
                </p>
                <p className="mt-1 text-xs text-nocturne-500">{testimonial.project}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
