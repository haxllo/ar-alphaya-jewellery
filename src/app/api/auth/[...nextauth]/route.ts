import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createServerClient } from "@/lib/supabase"

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required')
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
}
if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET is required')
}

// Initialize adapter with error handling
let adapter: any
try {
  adapter = SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
  console.log('SupabaseAdapter initialized successfully')
} catch (error) {
  console.error('Failed to initialize SupabaseAdapter:', error)
  throw error
}

export const authOptions = {
  adapter,
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const supabase = createServerClient()
          
          // Sign in with Supabase Auth
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          })

          if (error) {
            console.error('Supabase auth error:', error)
            throw new Error(error.message || 'Invalid email or password')
          }

          if (!data.user) {
            throw new Error('No user data returned')
          }

          // Return user object for NextAuth session
          // The adapter will handle creating/updating the user in the database
          const userData = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            image: data.user.user_metadata?.avatar_url || null,
            emailVerified: data.user.email_confirmed_at ? new Date(data.user.email_confirmed_at) : null,
          }
          
          console.log('Authorized user:', { id: userData.id, email: userData.email })
          return userData
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // The adapter will handle user creation/update in the database
      // Return true to allow sign in
      try {
        console.log('signIn callback - user:', { id: user?.id, email: user?.email })
        return true
      } catch (error) {
        console.error('signIn callback error:', error)
        return false
      }
    },
    async jwt({ token, user, account }: any) {
      // For JWT sessions, user is passed here on first sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }: any) {
      // For JWT sessions, token is provided instead of user
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.emailVerified = token.emailVerified as Date | null
      }
      return session
    },
  },
  // Ensure proper URL handling for Vercel
  trustHost: true,
  // Use environment variables for URLs
  url: process.env.NEXTAUTH_URL || process.env.AUTH_URL,
}

// NextAuth v5 returns { handlers, auth }
const { handlers, auth } = NextAuth(authOptions)

// Export handlers for route
export const { GET, POST } = handlers

// Export auth for use in server components
export { auth }

