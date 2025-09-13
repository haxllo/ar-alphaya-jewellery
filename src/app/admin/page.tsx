import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to the CMS index.html file
  redirect('/admin/index.html')
}
