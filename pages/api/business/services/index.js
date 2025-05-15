import { PrismaClient } from '@prisma/client'
import { withBusinessAuth } from '../../auth/business/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const services = await prisma.service.findMany({
          where: {
            businessId: req.user.businessId
          },
          include: {
            location: true,
            employees: true
          },
          orderBy: {
            name: 'asc'
          }
        })
        res.status(200).json(services)
      } catch (error) {
        console.error('Error fetching services:', error)
        res.status(500).json({ message: 'Error fetching services' })
      }
      break

    case 'POST':
      try {
        const { locationId, employeeIds, ...data } = req.body
        const service = await prisma.service.create({
          data: {
            ...data,
            businessId: req.user.businessId,
            location: locationId ? {
              connect: { id: locationId }
            } : undefined,
            employees: employeeIds?.length ? {
              connect: employeeIds.map(id => ({ id }))
            } : undefined
          },
          include: {
            location: true,
            employees: true
          }
        })
        res.status(201).json(service)
      } catch (error) {
        console.error('Error creating service:', error)
        res.status(500).json({ message: 'Error creating service' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withBusinessAuth(handler) 