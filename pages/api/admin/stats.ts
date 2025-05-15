// pages/api/admin/stats.js
import { NextApiRequest, NextApiResponse } from 'next'
import { withBusinessAuth } from '@/middleware/withAuth'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/utils/errors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: req.user.id },
      include: {
        locations: true,
        _count: {
          select: {
            employees: true,
            services: true,
            bookings: true
          }
        }
      }
    })

    if (!business) {
      throw new Error('Business not found')
    }

    // Get queue statistics
    const queueStats = await prisma.queue.groupBy({
      by: ['status'],
      where: {
        locationId: {
          in: business.locations.map(loc => loc.id)
        },
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      _count: true
    })

    res.status(200).json({
      business: {
        id: business.id,
        name: business.name,
        locations: business.locations
      },
      stats: {
        totalEmployees: business._count.employees,
        totalServices: business._count.services,
        totalBookings: business._count.bookings,
        queue: queueStats.reduce((acc, curr) => ({
          ...acc,
          [curr.status.toLowerCase()]: curr._count
        }), {})
      }
    })
  } catch (error) {
    const { statusCode, body } = errorHandler(error)
    return res.status(statusCode).json(body)
  }
}

export default withBusinessAuth(handler)