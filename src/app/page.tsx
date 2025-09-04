import Image from "next/image";

import Link from 'next/link'
import { getAllProducts } from '@/lib/cms/content'

export default function Home() {
  const products = getAllProducts().slice(0, 8)
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-primary-100 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-4xl font-serif tracking-tight text-primary-800">AR Alphaya Jewellery</h1>
          <p className="mt-4 text-primary-600 max-w-2xl">Fine jewelry and custom pieces. Discover rings, earrings, pendants and more.</p>
          <div className="mt-6 flex gap-4">
            <Link className="rounded bg-primary-800 text-primary-50 px-4 py-2 hover:bg-primary-700 transition-colors" href="/collections/rings">Shop Rings</Link>
            <Link className="rounded border border-primary-300 px-4 py-2 text-primary-700 hover:bg-primary-200 transition-colors" href="/collections/earrings">Shop Earrings</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6 text-primary-800">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group border border-border rounded p-3 hover:shadow-sm hover:border-primary-300 transition-all">
              <div className="aspect-square bg-primary-100 rounded mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-primary-800 group-hover:underline">{p.name}</h3>
                <span className="text-sm text-primary-600">Rs {p.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-primary-500 capitalize">{p.category.replace('-', ' ')}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
