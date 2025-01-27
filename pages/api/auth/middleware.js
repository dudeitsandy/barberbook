// pages/api/auth/middleware.js
import { getToken } from 'next-auth/jwt'

export async function withAuth(handler, requireBusiness = false) {
  return async function(req, res) {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' })
      }

      if (requireBusiness && token.role !== 'business') {
        return res.status(403).json({ message: 'Unauthorized' })
      }

      // Add user info to the request object
      req.user = {
        id: token.sub,
        email: token.email,
        role: token.role
      }
      
      return handler(req, res)
    } catch (error) {
      console.error('Auth error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}