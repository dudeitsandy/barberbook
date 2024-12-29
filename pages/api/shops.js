// pages/api/shops.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { shopName, ownerName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const shop = await prisma.shop.create({
      data: {
        name: shopName,
        ownerName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ shop: { id: shop.id, name: shop.name, email: shop.email } });
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({ message: 'Error creating shop' });
  }
}