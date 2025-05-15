import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ status: 'healthy' })
  } catch (error) {
    res.status(500).json({ status: 'unhealthy' })
  }
} 