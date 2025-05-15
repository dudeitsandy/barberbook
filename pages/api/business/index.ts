import { NextApiRequest, NextApiResponse } from 'next'
import { withBusinessAuth } from '@/middleware/withAuth'
import { BusinessService } from '@/services/businessService'
import { errorHandler } from '@/utils/errors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const businessId = req.user.businessId
        const business = await BusinessService.getBusinessDetails(businessId)
        return res.status(200).json(business)
      }

      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    const { statusCode, body } = errorHandler(error)
    return res.status(statusCode).json(body)
  }
}

export default withBusinessAuth(handler) 