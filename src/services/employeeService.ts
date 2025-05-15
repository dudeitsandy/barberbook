import { prisma } from '@/lib/prisma'
import { AppError } from '@/utils/errors'

export class EmployeeService {
  static async getEmployeeAvailability(
    employeeId: string,
    date: string
  ) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        bookings: {
          where: {
            date: {
              gte: new Date(`${date}T00:00:00`),
              lt: new Date(`${date}T23:59:59`)
            },
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          }
        },
        services: true
      }
    })

    if (!employee) {
      throw AppError.NotFound('Employee not found')
    }

    // Generate available time slots
    const workingHours = {
      start: 9, // 9 AM
      end: 17, // 5 PM
      interval: 30 // 30 minutes
    }

    const bookedSlots = employee.bookings.map(booking => ({
      start: booking.date,
      end: new Date(booking.date.getTime() + booking.service.duration * 60000)
    }))

    const availableSlots = []
    let currentTime = new Date(`${date}T${workingHours.start}:00:00`)
    const endTime = new Date(`${date}T${workingHours.end}:00:00`)

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + workingHours.interval * 60000)
      
      const isBooked = bookedSlots.some(slot => 
        (currentTime >= slot.start && currentTime < slot.end) ||
        (slotEnd > slot.start && slotEnd <= slot.end)
      )

      if (!isBooked) {
        availableSlots.push(currentTime.toISOString())
      }

      currentTime = slotEnd
    }

    return {
      employee,
      availableSlots
    }
  }
} 