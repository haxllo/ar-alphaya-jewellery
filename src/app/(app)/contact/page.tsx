'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    budget: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', budget: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 bg-neutral-soft">
      <div className="rounded-2xl bg-white/80 p-10 shadow-subtle border border-metal-gold/10">
        <p className="text-xs uppercase tracking-wider text-deep-black/40">Connect with our atelier</p>
        <h1 className="mt-3 font-serif font-normal text-4xl text-deep-black md:text-5xl">We would love to craft with you</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-deep-black/70">
          Share your inspirations, schedule a bespoke consultation, or ask about an existing piece. <strong>We welcome all budgets</strong>—from heirloom resets to milestone commissions. Free no-pressure design call for everyone. Our concierge team replies within 24 hours.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.05fr]">
        {/* Contact Information */}
        <div className="space-y-8 rounded-2xl border border-metal-gold/10 bg-white/70 p-8 shadow-subtle">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-deep-black/40">Atelier details</h2>
            <p className="mt-3 text-sm text-deep-black/70">
              143/5 Rainbow Park, Temple Road<br />
              Kengalla 20186, Sri Lanka
            </p>
          </div>

          <div className="grid gap-6 text-sm text-deep-black/70">
            <div>
              <p className="text-xs uppercase tracking-wider text-deep-black/40">Concierge</p>
              <p className="mt-2">
                <strong>Email:</strong> info@aralphayajewellery.com<br />
                <strong>Phone:</strong> +94 77 429 3406<br />
                <strong>WhatsApp:</strong> +94 77 429 3406
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-deep-black/40">Hours</p>
              <p className="mt-2">
                Mon–Fri: 9:00 AM – 6:00 PM<br />
                Saturday: 10:00 AM – 4:00 PM<br />
                Sunday: By appointment only
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-deep-black/40">Follow</p>
              <div className="mt-3 flex gap-4 text-deep-black/70">
                <a href="https://www.instagram.com/ar_alphaya_jewellery/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-metal-gold">Instagram</a>
                <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-metal-gold">WhatsApp</a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-metal-gold/20 bg-metal-gold/5 p-6 text-deep-black">
            <p className="text-xs uppercase tracking-wider text-deep-black/40">Appointments</p>
            <p className="mt-3 text-sm leading-relaxed">
              In-person and virtual consultations are available by reservation. Share your availability and we&apos;ll curate gemstones in advance.
            </p>
            <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-sm font-semibold text-deep-black underline-offset-6 hover:text-metal-gold hover:underline">
              Start a WhatsApp chat
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-metal-gold/10 bg-white/85 p-8 shadow-luxe">
          <h2 className="text-xs uppercase tracking-wider text-deep-black/40">Message us</h2>
          <p className="mt-2 font-serif font-normal text-2xl text-deep-black">Tell us about your dream piece</p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-wider text-deep-black/40">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  suppressHydrationWarning
                  className="w-full rounded-full border border-metal-gold/20 bg-white/70 px-4 py-3 text-sm text-deep-black placeholder:text-deep-black/30 focus:border-metal-gold focus:outline-none focus:ring-2 focus:ring-metal-gold/20"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-wider text-deep-black/40">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  suppressHydrationWarning
                  className="w-full rounded-full border border-metal-gold/20 bg-white/70 px-4 py-3 text-sm text-deep-black placeholder:text-deep-black/30 focus:border-metal-gold focus:outline-none focus:ring-2 focus:ring-metal-gold/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-wider text-deep-black/40">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full rounded-full border border-metal-gold/20 bg-white/70 px-4 py-3 text-sm text-deep-black placeholder:text-deep-black/30 focus:border-metal-gold focus:outline-none focus:ring-2 focus:ring-metal-gold/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-xs uppercase tracking-wider text-deep-black/40">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full rounded-full border border-metal-gold/20 bg-white/70 px-4 py-3 text-sm text-deep-black focus:border-metal-gold focus:outline-none focus:ring-2 focus:ring-metal-gold/20"
              >
                <option value="">Select a subject</option>
                <option value="general">General inquiry</option>
                <option value="custom">Custom design</option>
                <option value="repair">Repair service</option>
                <option value="appointment">Schedule appointment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-wider text-deep-black/40">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full rounded-2xl border border-metal-gold/20 bg-white/70 px-4 py-3 text-sm text-deep-black placeholder:text-deep-black/30 focus:border-metal-gold focus:outline-none focus:ring-2 focus:ring-metal-gold/20"
                placeholder="Share occasion dates, gemstones you love, or ideas you’ve collected."
              ></textarea>
            </div>

            {submitStatus === 'success' && (
              <div className="rounded-full bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 text-center">
                ✓ Thank you for your message! We will get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="rounded-full bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 text-center">
                {errorMessage || 'Something went wrong. Please try again.'}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full rounded-full bg-deep-black py-3 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-deep-black"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

