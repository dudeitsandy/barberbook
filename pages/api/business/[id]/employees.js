// pages/api/business/[id]/employees.js
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../../auth/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { id } = req.query // business id

  switch (req.method) {
    case 'GET':
      try {
        const employees = await prisma.employee.findMany({
          where: {
            businessId: id
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

    case 'POST':
      try {
        const { serviceIds, locationId, ...data } = req.body
        const employee = await prisma.employee.create({
          data: {
            ...data,
            business: {
              connect: { id }
            },
            location: {
              connect: { id: locationId }
            },
            services: {
              connect: serviceIds.map(serviceId => ({ id: serviceId }))
            }
          },
          include: {
            location: true,
            services: true
          }
        })
        res.status(201).json(employee)
      } catch (error) {
        console.error('Error creating employee:', error)
        res.status(500).json({ message: 'Error creating employee' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withAuth(handler, true) // Requires business owner role