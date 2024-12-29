// pages/api/bookings.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SERVICES = {
  'haircut': { price: 30, name: 'Haircut' },
  'haircut-and-beard': { price: 45, name: 'Haircut & Beard' },
  'beard-trim': { price: 20, name: 'Beard Trim' }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { service, date, time, name, email, shopId } = req.body

    // Create booking in database
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