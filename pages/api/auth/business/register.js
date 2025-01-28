// pages/api/auth/business/register.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, password, businessName } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Start a transaction to create both user and business
    const result = await prisma.$transaction(async (prisma) => {
      // Create user with business role
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: await bcrypt.hash(password, 10),
          role: 'BUSINESS'
        }
      })

      // Create business linked to user
      const business = await prisma.business.create({
        data: {
          name: businessName,
          ownerId: user.id
        }
      })

      return { user, business }
    })

    res.status(201).json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      },
      business: {
        id: result.business.id,
        name: result.business.name
      }
    })
  } catch (error) {
    console.error('Business registration error:', error)
    res.status(500).json({ message: 'Error registering business' })
  }
}