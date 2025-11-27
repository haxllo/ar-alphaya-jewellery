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
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="rounded-3xl bg-gradient-to-br from-amber-mirage-50 to-white/80 p-10 shadow-subtle border border-amber-mirage-200">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-mirage-600">Connect with our atelier</p>
        <h1 className="mt-3 font-serif text-4xl text-amber-mirage-brown md:text-5xl">We would love to craft with you</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-amber-mirage-700">
          Share your inspirations, schedule a bespoke consultation, or ask about an existing piece. <strong>We welcome all budgets</strong>—from heirloom resets to milestone commissions. Free no-pressure design call for everyone. Our concierge team replies within 24 hours.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.05fr]">
        {/* Contact Information */}
        <div className="space-y-8 rounded-3xl border border-amber-mirage-200 bg-white/70 p-8 shadow-subtle">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-amber-mirage-600">Atelier details</h2>
            <p className="mt-3 text-sm text-amber-mirage-700">
              143/5 Rainbow Park, Temple Road<br />
              Kengalla 20186, Sri Lanka
            </p>
          </div>

          <div className="grid gap-6 text-sm text-amber-mirage-700">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">Concierge</p>
              <p className="mt-2">
                <strong>Email:</strong> aralphayajewellery@gmail.com<br />
                <strong>Phone:</strong> +94 77 429 3406<br />
                <strong>WhatsApp:</strong> +94 77 429 3406
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">Hours</p>
              <p className="mt-2">
                Mon–Fri: 9:00 AM – 6:00 PM<br />
                Saturday: 10:00 AM – 4:00 PM<br />
                Sunday: By appointment only
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">Follow</p>
              <div className="mt-3 flex gap-4 text-amber-mirage-700">
                <a href="https://www.instagram.com/ar_alphaya_jewellery/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amber-mirage-gold">Instagram</a>
                <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amber-mirage-gold">WhatsApp</a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-mirage-gold/60 bg-amber-mirage-50/70 p-6 text-amber-mirage-700">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">Appointments</p>
            <p className="mt-3 text-sm leading-relaxed">
              In-person and virtual consultations are available by reservation. Share your availability and we&apos;ll curate gemstones in advance.
            </p>
            <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-sm font-semibold text-nocturne-700 underline-offset-6 hover:underline">
              Start a WhatsApp chat
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-3xl border border-amber-mirage-200 bg-white/85 p-8 shadow-luxe">
          <h2 className="text-xs uppercase tracking-[0.3em] text-amber-mirage-600">Message us</h2>
          <p className="mt-2 font-serif text-2xl text-amber-mirage-brown">Tell us about your dream piece</p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">
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
                  className="w-full rounded-lg border border-amber-mirage-200 bg-white/70 px-4 py-3 text-sm text-nocturne-700 placeholder:text-nocturne-300 focus:border-amber-mirage-gold focus:outline-none focus:ring-2 focus:ring-amber-mirage-gold/30"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">
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
                  className="w-full rounded-lg border border-amber-mirage-200 bg-white/70 px-4 py-3 text-sm text-nocturne-700 placeholder:text-nocturne-300 focus:border-amber-mirage-gold focus:outline-none focus:ring-2 focus:ring-amber-mirage-gold/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full rounded-lg border border-amber-mirage-200 bg-white/70 px-4 py-3 text-sm text-nocturne-700 placeholder:text-nocturne-300 focus:border-amber-mirage-gold focus:outline-none focus:ring-2 focus:ring-amber-mirage-gold/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full rounded-lg border border-amber-mirage-200 bg-white/70 px-4 py-3 text-sm text-nocturne-700 focus:border-amber-mirage-gold focus:outline-none focus:ring-2 focus:ring-amber-mirage-gold/30"
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
              <label htmlFor="message" className="text-xs uppercase tracking-[0.28em] text-amber-mirage-600">
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
                className="w-full rounded-3xl border border-amber-mirage-200 bg-white/70 px-4 py-3 text-sm text-nocturne-700 placeholder:text-nocturne-300 focus:border-amber-mirage-gold focus:outline-none focus:ring-2 focus:ring-amber-mirage-gold/30"
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
              className="w-full rounded-full bg-amber-mirage-brown py-3 text-sm font-semibold tracking-[0.25em] text-amber-mirage-soft transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-amber-mirage-brown/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

