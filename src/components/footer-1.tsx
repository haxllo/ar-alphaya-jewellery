import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

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
      icon: MessageCircle,
      link: "https://wa.me/94774293406",
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="relative bg-amber-mirage-soft">
      <div
        className={cn(
          "mx-auto max-w-5xl lg:border-x border-amber-mirage-200",
          "bg-[radial-gradient(35%_80%_at_30%_0%,rgb(196,139,40,0.1),transparent)]"
        )}
      >
        <div className="absolute inset-x-0 h-px w-full bg-amber-mirage-200" />
        <div className="grid max-w-5xl grid-cols-6 gap-6 p-4">
          <div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
            <Link className="w-max inline-flex items-center gap-3" href="/">
              <Image 
                src="/images/LOGO1.png" 
                alt="AR Alphaya Jewellery" 
                width={32} 
                height={32}
                className="object-contain"
              />
              <span className="font-serif text-lg text-amber-mirage-brown">
                AR Alphaya
              </span>
            </Link>
            <p className="max-w-sm text-balance font-mono text-amber-mirage-700 text-sm">
              Bespoke jewellery crafted by hand in Kandy, Sri Lanka. Custom pieces at everyday prices—affordable, personal, and made just for you.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item, index) => (
                <Button
                  key={`social-${item.link}-${index}`}
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 border-amber-mirage-200 hover:bg-amber-mirage-100 hover:text-amber-mirage-gold hover:border-amber-mirage-gold"
                  asChild
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                    <item.icon className="size-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-amber-mirage-600 text-xs">Resources</span>
            <div className="mt-2 flex flex-col gap-2">
              {resources.map(({ href, title }) => (
                <Link
                  className="w-max text-sm text-amber-mirage-brown hover:underline hover:text-amber-mirage-gold"
                  href={href}
                  key={title}
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-amber-mirage-600 text-xs">Company</span>
            <div className="mt-2 flex flex-col gap-2">
              {company.map(({ href, title }) => (
                <Link
                  className="w-max text-sm text-amber-mirage-brown hover:underline hover:text-amber-mirage-gold"
                  href={href}
                  key={title}
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 h-px w-full bg-amber-mirage-200" />
        <div className="flex max-w-4xl flex-col justify-between gap-2 py-4">
          <p className="text-center font-light text-amber-mirage-600 text-sm">
            &copy; {new Date().getFullYear()} AR Alphaya Jewellery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
