// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  // await prisma.favorite.deleteMany()
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
          // Create main location
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

  // Get locations
  const locations = await prisma.location.findMany({
    where: { businessId: business.id }
  })

  // Create services
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Kids & Seniors Cut',
        description: 'Special rate for children and senior citizens',
        duration: 30,
        price: 30.00,
        businessId: business.id,
        locationId: locations[0].id
      },
      {
        name: 'SMP Hair Line or Crown',
        description: 'Scalp micropigmentation service',
        duration: 180, // 3h
        price: 1500.00,
        businessId: business.id,
        locationId: locations[0].id
      },
      {
        name: 'Adult and Teen Cuts',
        description: 'Standard haircut service for adults and teens',
        duration: 30,
        price: 40.00,
        businessId: business.id,
        locationId: locations[0].id
      },
      {
        name: 'Adult Cut Full Service',
        description: 'Complete haircut service with additional styling',
        duration: 40,
        price: 50.00,
        businessId: business.id,
        locationId: locations[0].id
      },
      {
        name: 'SMP Consultation',
        description: 'Initial consultation for scalp micropigmentation',
        duration: 30,
        price: 100.00,
        businessId: business.id,
        locationId: locations[0].id
      }
    ]
  })

  // Create one employee
  const employee = await prisma.employee.create({
    data: {
      name: `Employee at ${locations[0].name}`,
      email: `employee@allstarsmb.com`,
      phone: '(555) 000-0000',
      businessId: business.id,
      locationId: locations[0].id,
      active: true
    }
  })

  // Get all services
  const allServices = await prisma.service.findMany()
  
  // Create one booking (remove the second booking that used locations[1])
  await prisma.booking.createMany({
    data: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'CONFIRMED',
        businessId: business.id,
        locationId: locations[0].id,
        serviceId: allServices[0].id,
        employeeId: employee.id,
        userId: customer.id,
        customerName: customer.name || 'John Customer',
        customerEmail: customer.email,
        customerPhone: '(555) 111-2222'
      }
    ]
  })

  // After creating services and employee, connect them
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      services: {
        connect: allServices.map(service => ({ id: service.id }))
      }
    }
  })

  // // Create a favorite
  // await prisma.favorite.create({
  //   data: {
  //     userId: customer.id,
  //     employeeId: employees[0].id
  //   }
  // })

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