'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here - could integrate with email service
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h1 className="text-4xl font-serif mb-6">Get in Touch</h1>
          <p className="text-neutral-600 mb-8">
            We&apos;d love to hear from you. Whether you&apos;re interested in our existing pieces or 
            want to discuss a custom design, we&apos;re here to help.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Visit Our Studio</h3>
              <p className="text-neutral-600">
                123 Jewelry Lane<br />
                Colombo 03, Sri Lanka
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-neutral-600">
                <strong>Email:</strong> info@aralphayajewellery.com<br />
                <strong>Phone:</strong> +94 XX XXX XXXX<br />
                <strong>WhatsApp:</strong> +94 XX XXX XXXX
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-neutral-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: By appointment only
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-600 hover:text-black">Facebook</a>
                <a href="#" className="text-neutral-600 hover:text-black">Instagram</a>
                <a href="#" className="text-neutral-600 hover:text-black">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-neutral-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="custom">Custom Design</option>
                <option value="repair">Repair Service</option>
                <option value="appointment">Schedule Appointment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Tell us about your jewelry needs or questions..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-6 rounded hover:bg-neutral-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
