import { withAuth } from '@/middleware/withAuth'
import { BookingService } from '@/services/bookingService'
import { errorHandler } from '@/utils/errors'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const booking = await BookingService.createBooking(req.body)
        return res.status(201).json(booking)
      }

      default:
        res.setHeader('Allow', ['POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    const { statusCode, body } = errorHandler(error)
    return res.status(statusCode).json(body)
  }
}

export default withAuth(handler) 