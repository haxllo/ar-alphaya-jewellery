import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import Script from 'next/script'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const session = await getServerSession()
  
  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // Check if user is admin
  const supabase = createServerClient()
  const { data: isAdmin } = await supabase
    .rpc('is_admin', { user_id: session.user.id })
    .single()

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="mb-2 text-xl font-bold text-red-900">Access Denied</h1>
          <p className="text-red-700">You don't have admin privileges.</p>
          <a 
            href="/" 
            className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script 
        id="uploadcare-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.UPLOADCARE_PUBLIC_KEY = '5eb856a1c841f37fa95c';`
        }}
      />
      <Script 
        src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js" 
        strategy="beforeInteractive"
      />
      {children}
    </>
  )
}
