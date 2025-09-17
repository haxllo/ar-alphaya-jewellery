import { Metadata } from 'next'
import CompareClient from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare Products | AR Alphaya Jewellery',
  description: 'Compare jewelry products side by side to find the perfect piece for you.',
}

export default function ComparePage() {
  return <CompareClient />
}
