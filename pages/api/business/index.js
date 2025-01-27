// pages/api/business/index.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const business = await prisma.business.findFirst({
          include: {
            locations: true,
            employees: true,
            services: true
          }
        })
        res.status(200).json(business)
      } catch (error) {
        console.error('Error fetching business:', error)
        res.status(500).json({ message: 'Error fetching business details' })
      }
      break

    case 'POST':
      try {
        const data = req.body
        const business = await prisma.business.create({
          data: {
            ...data,
            ownerId: req.user.id // This will come from auth middleware
          }
        })
        res.status(201).json(business)
      } catch (error) {
        console.error('Error creating business:', error)
        res.status(500).json({ message: 'Error creating business' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}