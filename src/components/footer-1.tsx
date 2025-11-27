import Link from "next/link";

export function FooterOne() {
  return (
    <footer className="w-full border-t border-amber-mirage-200 bg-amber-mirage-soft">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="font-serif text-2xl text-amber-mirage-brown">
                AR Alphaya Jewellery
              </h3>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-amber-mirage-700">
              Bespoke jewellery crafted by hand in Kandy, Sri Lanka. Custom pieces at everyday prices—affordable, personal, and made just for you.
            </p>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-mirage-brown">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-mirage-brown">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#process"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Custom Process
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/rings"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Policies
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-amber-mirage-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-amber-mirage-600">
              © {new Date().getFullYear()} AR Alphaya Jewellery. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="https://wa.me/94774293406"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-mirage-600 transition-colors hover:text-amber-mirage-gold"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
