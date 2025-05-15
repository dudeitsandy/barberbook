import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.queue.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.service.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.location.deleteMany()
  await prisma.business.deleteMany()
  await prisma.user.deleteMany()

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

  // Get the business and location we just created
  const business = await prisma.business.findFirst({
    where: { ownerId: businessOwner.id }
  })

  if (!business) throw new Error('Business not created')

  const location = await prisma.location.findFirst({
    where: { businessId: business.id }
  })

  if (!location) throw new Error('Location not created')

  // Create services
  const haircut = await prisma.service.create({
    data: {
      name: 'Haircut',
      description: 'Basic haircut service',
      duration: 30,
      price: 30.00,
      businessId: business.id,
      locationId: location.id
    }
  })

  const styling = await prisma.service.create({
    data: {
      name: 'Styling',
      description: 'Hair styling service',
      duration: 45,
      price: 45.00,
      businessId: business.id,
      locationId: location.id
    }
  })

  // Add some sample queue entries
  await prisma.queue.createMany({
    data: [
      {
        locationId: location.id,
        customerName: 'Walk-in Customer',
        serviceId: haircut.id,
        position: 1,
        status: 'WAITING',
        estimatedTime: new Date(Date.now() + 30 * 60000) // 30 minutes from now
      },
      {
        locationId: location.id,
        customerName: 'Another Customer',
        serviceId: styling.id,
        position: 2,
        status: 'WAITING',
        estimatedTime: new Date(Date.now() + 60 * 60000) // 60 minutes from now
      }
    ]
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 