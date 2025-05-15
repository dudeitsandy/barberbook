import { PrismaClient } from '@prisma/client'
import { withBusinessAuth } from '../../auth/business/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const employees = await prisma.employee.findMany({
          where: {
            businessId: req.user.businessId
          },
          include: {
            location: true,
            services: true
          }
        })
        res.status(200).json(employees)
      } catch (error) {
        console.error('Error fetching employees:', error)
        res.status(500).json({ message: 'Error fetching employees' })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withBusinessAuth(handler) 