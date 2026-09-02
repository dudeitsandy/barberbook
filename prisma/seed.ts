import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.queue.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.service.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.location.deleteMany(),
    prisma.business.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // Create test users
  const customerPassword = await bcrypt.hash('customer123', 10)
  const businessPassword = await bcrypt.hash('business123', 10)

  const customer = await prisma.user.create({
    data: {
      name: 'John Customer',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'CUSTOMER'
    }
  })

  const businessOwner = await prisma.user.create({
    data: {
      name: 'All Star SMB Owner',
      email: 'owner@allstarsmb.com',
      password: businessPassword,
      role: 'BUSINESS',
      businessOwned: {
        create: {
          name: "All Star SMB",
          phone: '(555) 123-4567',
          address: '123 Main St',
          locations: {
            create: [
              {
                name: 'All Star SMB Main',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                phone: '(555) 123-4567',
                email: 'info@allstarsmb.com'
              }
            ]
          }
        }
      }
    }
  })

  console.log('Seeded database with test users:')
  console.log('Customer:', customer.email)
  console.log('Business Owner:', businessOwner.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 