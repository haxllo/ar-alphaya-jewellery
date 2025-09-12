import Image from "next/image";
import Link from 'next/link'
import { getProducts } from '@/lib/cms'
import FeaturedProducts from './FeaturedProducts'

export default async function Home() {
  const products = (await getProducts()).slice(0, 8)
  return (
    <div className="min-h-screen">
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center mb-8">
            <Image 
              src="/images/BRAND.svg" 
              alt="AR Alphaya Jewellery Brand" 
              width={400} 
              height={200}
              className="w-auto h-16 md:h-20 lg:h-24 mx-auto mb-4 object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">Fine jewelry and custom pieces. Discover rings, earrings, pendants and more.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link className="rounded bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium text-center" href="/collections/rings">Shop Rings</Link>
              <Link className="rounded border border-gray-300 px-6 py-3 text-black hover:bg-gray-100 transition-colors font-medium text-center" href="/collections/earrings">Shop Earrings</Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts products={products} />
    </div>
  )
}
