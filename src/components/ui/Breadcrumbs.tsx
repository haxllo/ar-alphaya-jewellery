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
    <nav className="text-xs uppercase tracking-[0.3em] text-nocturne-500" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <Link 
              href={item.href} 
              className="underline-offset-4 hover:underline hover:text-nocturne-700 transition-colors"
            >
              {item.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li className="text-nocturne-400" aria-current="page">
          {currentPage}
        </li>
      </ol>
    </nav>
  )
}
