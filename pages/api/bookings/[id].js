// pages/api/bookings/[id].js
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../auth/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      try {
        const booking = await prisma.booking.findUnique({
          where: { id },
          include: {
            shop: true,
            service: true,
            employee: true
          }
        })

        if (!booking) {
          return res.status(404).json({ message: 'Booking not found' })
        }

        // Check if user has permission to view this booking
        if (req.user.role === 'business' && booking.shopId !== req.user.shopId) {
          return res.status(403).json({ message: 'Not authorized to view this booking' })
        }

        res.status(200).json(booking)
      } catch (error) {
        console.error('Error fetching booking:', error)
        res.status(500).json({ message: 'Error fetching booking' })
      }
      break

    case 'PUT':
      try {
        const existingBooking = await prisma.booking.findUnique({
          where: { id }
        })

        if (!existingBooking) {
          return res.status(404).json({ message: 'Booking not found' })
        }

        // Check if user has permission to update this booking
        if (req.user.role === 'business' && existingBooking.shopId !== req.user.shopId) {
          return res.status(403).json({ message: 'Not authorized to update this booking' })
        }

        const booking = await prisma.booking.update({
          where: { id },
          data: {
            status: req.body.status,
            date: req.body.date ? new Date(req.body.date) : undefined,
            service: req.body.serviceId ? {
              connect: { id: req.body.serviceId }
            } : undefined,
            employee: req.body.employeeId ? {
              connect: { id: req.body.employeeId }
            } : undefined
          },
          include: {
            shop: true,
            service: true,
            employee: true
          }
        })
        res.status(200).json(booking)
      } catch (error) {
        console.error('Error updating booking:', error)
        res.status(500).json({ message: 'Error updating booking' })
      }
      break

    case 'DELETE':
      try {
        const existingBooking = await prisma.booking.findUnique({
          where: { id }
        })

        if (!existingBooking) {
          return res.status(404).json({ message: 'Booking not found' })
        }

        // Check if user has permission to delete this booking
        if (req.user.role === 'business' && existingBooking.shopId !== req.user.shopId) {
          return res.status(403).json({ message: 'Not authorized to delete this booking' })
        }

        await prisma.booking.delete({
          where: { id }
        })
        res.status(204).end()
      } catch (error) {
        console.error('Error deleting booking:', error)
        res.status(500).json({ message: 'Error deleting booking' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withAuth(handler)