// pages/api/bookings/index.js
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../auth/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { service, date, time, name, email, shopId } = req.body

    const booking = await prisma.booking.create({
      data: {
        shopId,
        customerName: name,
        customerEmail: email,
        date: new Date(`${date}T${time}`),
        service: SERVICES[service].name,
        status: 'confirmed'
      }
    })

    res.status(200).json({ booking })
  } catch (error) {
    console.error('Booking error:', error)
    res.status(500).json({ message: 'Error creating booking' })
  }
}

// No business role required for bookings
export default withAuth(handler, false)