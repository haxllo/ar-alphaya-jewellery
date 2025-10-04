import { redirect } from 'next/navigation'

// Compare feature removed - redirecting to collections
export default function ComparePage() {
  redirect('/collections/rings')
}
