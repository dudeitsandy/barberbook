import { prisma } from '@/lib/prisma'
import { AppError } from '@/utils/errors'

export class BusinessService {
  static async getBusinessDetails(businessId: string) {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        locations: true,
        employees: true,
        services: true,
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!business) {
      throw AppError.NotFound('Business not found')
    }

    return business
  }

  static async getBusinessStats(businessId: string) {
    const [business, recentBookings, stats] = await Promise.all([
      this.getBusinessDetails(businessId),
      prisma.booking.findMany({
        where: { businessId },
        include: {
          service: true,
          employee: true
        },
        orderBy: { date: 'desc' },
        take: 5
      }),
      prisma.booking.groupBy({
        by: ['status'],
        where: { businessId },
        _count: true
      })
    ])

    return {
      business,
      recentBookings,
      stats: stats.reduce((acc, curr) => ({
        ...acc,
        [curr.status.toLowerCase()]: curr._count
      }), {})
    }
  }
} 