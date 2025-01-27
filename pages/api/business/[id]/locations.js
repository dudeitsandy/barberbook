// pages/api/business/[id]/locations.js
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../../auth/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { id } = req.query // business id

  switch (req.method) {
    case 'GET':
      try {
        const locations = await prisma.location.findMany({
          where: {
            businessId: id
          },
          include: {
            employees: true,
            services: true
          }
        })
        res.status(200).json(locations)
      } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: 'Error fetching locations' })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withAuth(handler, true)