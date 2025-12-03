import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  currentPage: string
}

export default function Breadcrumbs({ items, currentPage }: BreadcrumbsProps) {
  return (
    <nav className="text-xs uppercase tracking-[0.3em] text-deep-black-500" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap leading-none">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 leading-none">
            <Link 
              href={item.href} 
              className="underline-offset-4 hover:underline hover:text-deep-black-700 transition-colors leading-none"
            >
              {item.label}
            </Link>
            <span aria-hidden="true" className="leading-none text-amber-mirage-400">/</span>
          </li>
        ))}
        <li className="text-deep-black-400 leading-none" aria-current="page">
          {currentPage}
        </li>
      </ol>
    </nav>
  )
}
