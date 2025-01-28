// pages/api/auth/business/middleware.js
import { getToken } from 'next-auth/jwt'

export async function withBusinessAuth(handler) {
  return async function(req, res) {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' })
      }

      if (token.role !== 'BUSINESS') {
        return res.status(403).json({ message: 'Business access only' })
      }

      // Add business user info to request
      const prisma = new PrismaClient()
      const business = await prisma.business.findFirst({
        where: { ownerId: token.sub }
      })

      if (!business) {
        return res.status(404).json({ message: 'Business not found' })
      }

      req.user = {
        id: token.sub,
        email: token.email,
        role: token.role,
        businessId: business.id
      }
      
      return handler(req, res)
    } catch (error) {
      console.error('Business auth error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}