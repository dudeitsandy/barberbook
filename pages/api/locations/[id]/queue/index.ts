import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from '@/middleware/withAuth'
import { QueueService } from '@/services/queueService'
import { errorHandler } from '@/utils/errors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id: locationId } = req.query

    if (!locationId || Array.isArray(locationId)) {
      return res.status(400).json({ message: 'Invalid location ID' })
    }

    switch (req.method) {
      case 'GET': {
        const queue = await QueueService.getCurrentQueue(locationId)
        return res.status(200).json(queue)
      }

      case 'POST': {
        const { serviceId, customerName, customerPhone, customerId, notes } = req.body
        const queueEntry = await QueueService.addToQueue({
          locationId,
          serviceId,
          customerName,
          customerPhone,
          customerId,
          notes
        })
        return res.status(201).json(queueEntry)
      }

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    const { statusCode, body } = errorHandler(error)
    return res.status(statusCode).json(body)
  }
}

export default withAuth(handler) 