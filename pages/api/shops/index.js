// pages/api/shops/index.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const shops = await prisma.shop.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          _count: {
            select: {
              Booking: true
            }
          }
        }
      })
      res.status(200).json(shops)
    } catch (error) {
      console.error('Error fetching shops:', error)
      res.status(500).json({ message: 'Error fetching shops' })
    }
  } else if (req.method === 'POST') {
    try {
      const { shopName, ownerName, email, password } = req.body
      const shop = await prisma.shop.create({
        data: {
          name: shopName,
          ownerName,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })
      res.status(201).json({ shop })
    } catch (error) {
      console.error('Error creating shop:', error)
      res.status(500).json({ message: 'Error creating shop' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }
}