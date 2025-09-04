import Image from "next/image";

import Link from 'next/link'
import { getAllProducts } from '@/lib/cms/content'

export default function Home() {
  const products = getAllProducts().slice(0, 8)
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-b from-neutral-50 to-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-4xl font-serif tracking-tight">AR Alphaya Jewellery</h1>
          <p className="mt-4 text-neutral-600 max-w-2xl">Fine jewelry and custom pieces. Discover rings, earrings, pendants and more.</p>
          <div className="mt-6 flex gap-4">
            <Link className="rounded bg-black text-white px-4 py-2" href="/collections/rings">Shop Rings</Link>
            <Link className="rounded border px-4 py-2" href="/collections/earrings">Shop Earrings</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group border rounded p-3 hover:shadow-sm">
              <div className="aspect-square bg-neutral-100 rounded mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-medium group-hover:underline">{p.name}</h3>
                <span className="text-sm">Rs {p.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-neutral-500 capitalize">{p.category.replace('-', ' ')}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
