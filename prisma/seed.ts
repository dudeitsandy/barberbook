// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.favorite.deleteMany()
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
      name: 'Bob Barber',
      email: 'business@example.com',
      password: businessPassword,
      role: 'BUSINESS',
      businessOwned: {
        create: {
          name: "Bob's Barbershop",
          phone: '(555) 123-4567',
          address: '123 Main St',
          // Create locations for the business
          locations: {
            create: [
              {
                name: 'Downtown Location',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                phone: '(555) 123-4567',
                email: 'downtown@bobsbarbershop.com'
              },
              {
                name: 'Uptown Location',
                address: '456 Park Ave',
                city: 'New York',
                state: 'NY',
                zipCode: '10002',
                phone: '(555) 987-6543',
                email: 'uptown@bobsbarbershop.com'
              }
            ]
          }
        }
      }
    }
  })

  // Get the business we just created
  const business = await prisma.business.findFirst({
    where: { ownerId: businessOwner.id }
  })

  if (!business) throw new Error('Business not created')

  // Get locations
  const locations = await prisma.location.findMany({
    where: { businessId: business.id }
  })

  // Create services
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Haircut',
        description: 'Classic haircut with styling',
        duration: 30,
        price: 30.00,
        businessId: business.id,
        locationId: locations[0].id
      },
      {
        name: 'Beard Trim',
        description: 'Professional beard trimming and shaping',
        duration: 20,
        price: 20.00,
        businessId: business.id,
        locationId: locations[0].id
      },
      {
        name: 'Haircut & Beard',
        description: 'Full service haircut and beard trim',
        duration: 45,
        price: 45.00,
        businessId: business.id,
        locationId: locations[0].id
      }
    ]
  })

  // Create employees
  const employees = await Promise.all(
    locations.map(async (location) => {
      return prisma.employee.create({
        data: {
          name: `Employee at ${location.name}`,
          email: `employee${location.id}@bobsbarbershop.com`,
          phone: '(555) 000-0000',
          businessId: business.id,
          locationId: location.id,
          active: true
        }
      })
    })
  )

  // Create some sample bookings
  const allServices = await prisma.service.findMany()
  
  await prisma.booking.createMany({
    data: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'CONFIRMED',
        businessId: business.id,
        locationId: locations[0].id,
        serviceId: allServices[0].id,
        employeeId: employees[0].id,
        userId: customer.id,
        customerName: customer.name || 'John Customer',
        customerEmail: customer.email,
        customerPhone: '(555) 111-2222'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        status: 'PENDING',
        businessId: business.id,
        locationId: locations[1].id,
        serviceId: allServices[1].id,
        employeeId: employees[1].id,
        customerName: 'Walk-in Customer',
        customerEmail: 'walkin@example.com',
        customerPhone: '(555) 333-4444'
      }
    ]
  })

  // Create a favorite
  await prisma.favorite.create({
    data: {
      userId: customer.id,
      employeeId: employees[0].id
    }
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