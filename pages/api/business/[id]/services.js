// pages/api/business/[id]/services.js
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../../auth/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { id } = req.query // business id

  switch (req.method) {
    case 'GET':
      try {
        const services = await prisma.service.findMany({
          where: {
            businessId: id
          },
          include: {
            location: true,
            employees: true
          }
        })
        res.status(200).json(services)
      } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: 'Error fetching services' })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withAuth(handler, true)