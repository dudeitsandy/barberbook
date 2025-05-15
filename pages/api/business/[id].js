import { PrismaClient } from '@prisma/client'
import { withBusinessAuth } from '../auth/business/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: req.query.id },
      include: {
        locations: true,
        services: {
          include: {
            location: true
          }
        },
        employees: {
          include: {
            location: true,
            services: true
          }
        }
      }
    })

    if (!business) {
      return res.status(404).json({ message: 'Business not found' })
    }

    res.status(200).json(business)
  } catch (error) {
    console.error('Error fetching business:', error)
    res.status(500).json({ message: 'Error fetching business details' })
  }
}

export default withBusinessAuth(handler) 