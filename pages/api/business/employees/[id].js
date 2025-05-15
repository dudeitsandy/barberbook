import { PrismaClient } from '@prisma/client'
import { withBusinessAuth } from '../../auth/business/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { id } = req.query

  switch (req.method) {
    case 'PATCH':
      try {
        // Verify employee belongs to this business
        const employee = await prisma.employee.findFirst({
          where: {
            id,
            businessId: req.user.businessId
          }
        })

        if (!employee) {
          return res.status(404).json({ message: 'Employee not found' })
        }

        const updatedEmployee = await prisma.employee.update({
          where: { id },
          data: req.body,
          include: {
            location: true,
            services: true
          }
        })

        res.status(200).json(updatedEmployee)
      } catch (error) {
        console.error('Error updating employee:', error)
        res.status(500).json({ message: 'Error updating employee' })
      }
      break

    default:
      res.setHeader('Allow', ['PATCH'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withBusinessAuth(handler) 