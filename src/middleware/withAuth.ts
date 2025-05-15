import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { AppError } from '@/utils/errors'

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string
    email: string
    role: string
    businessId?: string
  }
}

export const withAuth = (handler: NextApiHandler) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const session = await getSession({ req })
      
      if (!session?.user) {
        throw AppError.Unauthorized()
      }

      req.user = session.user
      return handler(req, res)
    } catch (error) {
      const { statusCode, body } = errorHandler(error)
      return res.status(statusCode).json(body)
    }
  }
}

export const withBusinessAuth = (handler: NextApiHandler) => {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user.role !== 'BUSINESS') {
      throw AppError.Unauthorized('Business access required')
    }
    return handler(req, res)
  })
} 