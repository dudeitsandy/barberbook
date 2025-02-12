import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default NextAuth({
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
            throw new Error('Email and password required')
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              businessOwned: true // Include business data
            }
          })

          console.log('Found user:', user) // Add this log

          if (!user) {
            throw new Error('No user found')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          console.log('Password valid:', isValid) // Add this log

          if (!isValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            businessId: user.businessOwned?.id
          }
        } catch (error) {
          console.error('Auth error:', error) // Add detailed error logging
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.sub
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
})