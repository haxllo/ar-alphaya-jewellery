import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

/**
 * Get the current session on the server side
 * Use this in Server Components and API routes
 */
export async function getServerSession() {
  return await auth()
}

/**
 * Require authentication - redirects to sign in if not authenticated
 * Use this in Server Components that require auth
 */
export async function requireAuth() {
  const session = await getServerSession()
  if (!session) {
    redirect("/auth/signin")
  }
  return session
}
