import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

// Threads icon component (Lucide doesn't have it yet)
function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 192 192" fill="currentColor">
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
    </svg>
  );
}

export function FooterOne() {
  const resources = [
    { title: "About Us", href: "/about" },
    { title: "Contact Support", href: "/contact" },
    { title: "Shipping", href: "/shipping" },
    { title: "Returns", href: "/returns" },
    { title: "FAQ", href: "/#faq" },
  ];

  const company = [
    { title: "Custom Process", href: "/#process" },
    { title: "Collections", href: "/collections/rings" },
    { title: "Policies", href: "/policies" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      link: "https://www.instagram.com/ar_alphaya_jewellery/",
      label: "Instagram",
    },
    {
      icon: Facebook,
      link: "https://www.facebook.com/538512576015293",
      label: "Facebook",
    },
    {
      icon: ThreadsIcon,
      link: "https://www.threads.com/@ar_alphaya_jewellery?xmt=AQF00j8nVspC02Z4eNt0_QgaLzQKzRhd9zvwy7eNgpTxxx0",
      label: "Threads",
    },
    {
      icon: MessageCircle,
      link: "https://wa.me/94774293406",
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="relative bg-neutral-soft border-t border-deep-black/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 lg:gap-12 px-8 py-12 lg:py-16">
          {/* Brand Section - 3 columns on desktop */}
          <div className="md:col-span-6 lg:col-span-3 space-y-6">
            <Link className="inline-flex items-center gap-3" href="/">
              <Image 
                src="/images/LOGO1.png" 
                alt="AR Alphaya Jewellery" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="font-serif text-xl font-medium text-deep-black">
                AR Alphaya
              </span>
            </Link>
            <p className="max-w-md text-base leading-relaxed text-deep-black/70">
              Bespoke jewellery crafted by hand in Kandy, Sri Lanka. Custom pieces at everyday prices—affordable, personal, and made just for you.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item, index) => (
                <a
                  key={`social-${item.link}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-deep-black/10 bg-white/80 text-deep-black/60 transition-all hover:bg-deep-black hover:text-white hover:border-deep-black"
                >
                  <item.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Resources - 1 column */}
          <div className="md:col-span-3 lg:col-span-1 space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-deep-black/40">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map(({ href, title }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-sm text-deep-black/70 transition-colors hover:text-deep-black"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company - 1 column */}
          <div className="md:col-span-3 lg:col-span-1 space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-deep-black/40">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map(({ href, title }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-sm text-deep-black/70 transition-colors hover:text-deep-black"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact - 1 column */}
          <div className="md:col-span-6 lg:col-span-1 space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-deep-black/40">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a 
                href="mailto:info@aralphayajewellery.com"
                className="flex items-center gap-2 text-sm text-deep-black/70 hover:text-deep-black transition-colors"
              >
                <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <a 
                href="tel:+94774293406"
                className="flex items-center gap-2 text-sm text-deep-black/70 hover:text-deep-black transition-colors"
              >
                <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +94 77 429 3406
              </a>
              <a
                href="https://wa.me/94774293406?text=Hi!%20I'd%20like%20to%20discuss%20a%20custom%20piece"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-green-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-deep-black/5 px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-deep-black/50 text-center md:text-left">
              &copy; {new Date().getFullYear()} AR Alphaya Jewellery. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-xs text-deep-black/50">
              <Link href="/policies#returns" className="hover:text-deep-black transition-colors">
                Returns
              </Link>
              <Link href="/policies#privacy" className="hover:text-deep-black transition-colors">
                Privacy
              </Link>
              <Link href="/policies#terms" className="hover:text-deep-black transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
