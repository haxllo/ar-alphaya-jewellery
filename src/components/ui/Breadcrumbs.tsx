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
    <nav className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-deep-black-500 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 whitespace-nowrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <Link 
              href={item.href} 
              className="underline-offset-4 hover:underline hover:text-deep-black-700 transition-colors"
            >
              {item.label}
            </Link>
            <span aria-hidden="true" className="text-amber-mirage-400 select-none">/</span>
          </li>
        ))}
        <li className="text-deep-black-400" aria-current="page">
          {currentPage}
        </li>
      </ol>
    </nav>
  )
}
