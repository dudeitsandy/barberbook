import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/utils/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid queue ID' })
    }

    const queueEntry = await prisma.queue.findUnique({
      where: { id },
      include: {
        service: true,
        employee: true,
        location: true
      }
    })

    if (!queueEntry) {
      return res.status(404).json({ message: 'Queue entry not found' })
    }

    return res.status(200).json(queueEntry)
  } catch (error) {
    const { statusCode, body } = errorHandler(error)
    return res.status(statusCode).json(body)
  }
} 