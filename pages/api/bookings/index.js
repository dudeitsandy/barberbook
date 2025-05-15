// pages/api/bookings/index.js
import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from '@/middleware/withAuth'
import { BookingService } from '@/services/bookingService'
import { QueueService } from '@/services/queueService'
import { errorHandler } from '@/utils/errors'

async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST': {
        const { type = 'appointment', ...data } = req.body

        if (type === 'queue') {
          const queueEntry = await QueueService.addToQueue(data)
          return res.status(201).json(queueEntry)
        }

        const booking = await BookingService.createBooking(data)
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

// No business role required for bookings
export default withAuth(handler, false)