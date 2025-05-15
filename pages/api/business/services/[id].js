import { PrismaClient } from '@prisma/client'
import { withBusinessAuth } from '../../auth/business/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      try {
        const service = await prisma.service.findFirst({
          where: {
            id,
            businessId: req.user.businessId
          },
          include: {
            location: true,
            employees: true
          }
        })

        if (!service) {
          return res.status(404).json({ message: 'Service not found' })
        }

        res.status(200).json(service)
      } catch (error) {
        console.error('Error fetching service:', error)
        res.status(500).json({ message: 'Error fetching service' })
      }
      break

    case 'PUT':
      try {
        const { locationId, employeeIds, ...data } = req.body
        
        // Verify service belongs to this business
        const existingService = await prisma.service.findFirst({
          where: {
            id,
            businessId: req.user.businessId
          }
        })

        if (!existingService) {
          return res.status(404).json({ message: 'Service not found' })
        }

        const updatedService = await prisma.service.update({
          where: { id },
          data: {
            ...data,
            location: locationId ? {
              connect: { id: locationId }
            } : undefined,
            employees: employeeIds ? {
              set: employeeIds.map(id => ({ id }))
            } : undefined
          },
          include: {
            location: true,
            employees: true
          }
        })

        res.status(200).json(updatedService)
      } catch (error) {
        console.error('Error updating service:', error)
        res.status(500).json({ message: 'Error updating service' })
      }
      break

    case 'DELETE':
      try {
        // Verify service belongs to this business
        const service = await prisma.service.findFirst({
          where: {
            id,
            businessId: req.user.businessId
          }
        })

        if (!service) {
          return res.status(404).json({ message: 'Service not found' })
        }

        await prisma.service.delete({
          where: { id }
        })

        res.status(204).end()
      } catch (error) {
        console.error('Error deleting service:', error)
        res.status(500).json({ message: 'Error deleting service' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withBusinessAuth(handler) 