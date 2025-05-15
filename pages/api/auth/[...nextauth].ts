import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { AppError } from '@/utils/errors'

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw AppError.BadRequest('Email and password required')
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              businessOwned: true
            }
          })

          if (!user) {
            throw AppError.NotFound('User not found')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            throw AppError.Unauthorized('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            businessId: user.businessOwned?.id
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.businessId = user.businessId
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.sub
      session.user.businessId = token.businessId
      return session
    }
  }
}

export default NextAuth(authConfig) 