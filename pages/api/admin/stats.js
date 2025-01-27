// pages/api/admin/stats.js
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../auth/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get all businesses owned by the user
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: req.user.id
      },
      include: {
        _count: {
          select: {
            locations: true,
            employees: true,
            bookings: true
          }
        }
      }
    })

    // Get recent bookings across all businesses
    const recentBookings = await prisma.booking.findMany({
      where: {
        business: {
          ownerId: req.user.id
        }
      },
      include: {
        business: {
          select: {
            name: true
          }
        },
        service: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 5
    })

    // Calculate totals
    const stats = businesses.reduce((acc, business) => ({
      totalLocations: acc.totalLocations + business._count.locations,
      totalEmployees: acc.totalEmployees + business._count.employees,
      totalBookings: acc.totalBookings + business._count.bookings
    }), {
      totalLocations: 0,
      totalEmployees: 0,
      totalBookings: 0
    })

    // Format the response
    const response = {
      totalBusinesses: businesses.length,
      totalLocations: stats.totalLocations,
      totalEmployees: stats.totalEmployees,
      totalBookings: stats.totalBookings,
      businesses: businesses.map(business => ({
        id: business.id,
        name: business.name,
        locationCount: business._count.locations,
        employeeCount: business._count.employees,
        bookingCount: business._count.bookings
      })),
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        businessName: booking.business.name,
        customerName: booking.customerName,
        service: booking.service.name,
        date: booking.date,
        status: booking.status
      }))
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    res.status(500).json({ message: 'Error fetching admin stats' })
  }
}

// Protect this route and require business owner role
export default withAuth(handler, true)