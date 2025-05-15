import { prisma } from '@/lib/prisma'
import { AppError } from '@/utils/errors'
import { addMinutes, isWithinInterval, parse } from 'date-fns'

export class BookingService {
  static async checkAvailability(
    employeeId: string,
    date: string,
    time: string,
    duration: number
  ) {
    const startTime = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date())
    const endTime = addMinutes(startTime, duration)

    // Check existing bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        employeeId,
        date: {
          gte: startTime,
          lt: endTime,
        },
        status: {
          in: ['CONFIRMED', 'PENDING']
        }
      }
    })

    if (conflictingBookings.length > 0) {
      throw AppError.BadRequest('Time slot not available')
    }

    return true
  }

  static async createBooking(data: {
    serviceId: string
    employeeId: string
    date: string
    time: string
    customerId?: string
    customerName: string
    customerEmail: string
    customerPhone?: string
  }) {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    })

    if (!service) {
      throw AppError.NotFound('Service not found')
    }

    // Check availability
    await this.checkAvailability(
      data.employeeId,
      data.date,
      data.time,
      service.duration
    )

    // Create booking
    return prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        employeeId: data.employeeId,
        date: parse(`${data.date} ${data.time}`, 'yyyy-MM-dd HH:mm', new Date()),
        userId: data.customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        status: 'PENDING'
      }
    })
  }
} 