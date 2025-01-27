// pages/api/shops/[id].js
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../auth/middleware'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      try {
        const shop = await prisma.shop.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            ownerName: true,
            createdAt: true,
            _count: {
              select: {
                Booking: true
              }
            }
          }
        })

        if (!shop) {
          return res.status(404).json({ message: 'Shop not found' })
        }

        // If authenticated user is not the shop owner, return limited data
        if (req.user?.role !== 'business' || req.user?.shopId !== id) {
          delete shop.email
          delete shop.ownerName
        }

        res.status(200).json(shop)
      } catch (error) {
        console.error('Error fetching shop:', error)
        res.status(500).json({ message: 'Error fetching shop' })
      }
      break

    case 'PUT':
      try {
        // Check if user is authorized to update shop
        if (req.user?.role !== 'business' || req.user?.shopId !== id) {
          return res.status(403).json({ message: 'Not authorized to update this shop' })
        }

        const { name, ownerName } = req.body
        const shop = await prisma.shop.update({
          where: { id },
          data: {
            name,
            ownerName
          },
          select: {
            id: true,
            name: true,
            email: true,
            ownerName: true
          }
        })
        res.status(200).json(shop)
      } catch (error) {
        console.error('Error updating shop:', error)
        res.status(500).json({ message: 'Error updating shop' })
      }
      break

    case 'DELETE':
      try {
        // Check if user is authorized to delete shop
        if (req.user?.role !== 'business' || req.user?.shopId !== id) {
          return res.status(403).json({ message: 'Not authorized to delete this shop' })
        }

        await prisma.shop.delete({
          where: { id }
        })
        res.status(204).end()
      } catch (error) {
        console.error('Error deleting shop:', error)
        res.status(500).json({ message: 'Error deleting shop' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// Allow public access to GET, but require auth for PUT and DELETE
export default async function (req, res) {
  if (req.method === 'GET') {
    return handler(req, res)
  }
  return withAuth(handler)(req, res)
}