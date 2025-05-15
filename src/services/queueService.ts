import { prisma } from '@/lib/prisma'
import { AppError } from '@/utils/errors'
import { addMinutes } from 'date-fns'

export class QueueService {
  static async getCurrentQueue(locationId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return prisma.queue.findMany({
      where: {
        locationId,
        date: {
          gte: today
        },
        status: {
          in: ['WAITING', 'IN_SERVICE']
        }
      },
      include: {
        service: true,
        employee: true
      },
      orderBy: {
        position: 'asc'
      }
    })
  }

  static async addToQueue({
    locationId,
    serviceId,
    customerName,
    customerPhone,
    customerId,
    notes
  }: {
    locationId: string
    serviceId: string
    customerName: string
    customerPhone?: string
    customerId?: string
    notes?: string
  }) {
    // Get the service details for duration calculation
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      throw AppError.NotFound('Service not found')
    }

    // Get the current queue position
    const lastInQueue = await prisma.queue.findFirst({
      where: {
        locationId,
        status: 'WAITING'
      },
      orderBy: {
        position: 'desc'
      }
    })

    const position = lastInQueue ? lastInQueue.position + 1 : 1

    // Calculate estimated time
    const currentQueue = await this.getCurrentQueue(locationId)
    const totalWaitTime = currentQueue.reduce((acc, item) => {
      return acc + (item.service.duration || 0)
    }, 0)

    const estimatedTime = addMinutes(new Date(), totalWaitTime)

    return prisma.queue.create({
      data: {
        locationId,
        serviceId,
        customerName,
        customerPhone,
        customerId,
        notes,
        position,
        estimatedTime,
        status: 'WAITING'
      },
      include: {
        service: true
      }
    })
  }

  static async updateQueueStatus(
    queueId: string,
    status: 'WAITING' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
    employeeId?: string
  ) {
    const queue = await prisma.queue.findUnique({
      where: { id: queueId }
    })

    if (!queue) {
      throw AppError.NotFound('Queue entry not found')
    }

    const updates: any = { status }

    if (status === 'IN_SERVICE') {
      updates.actualStartTime = new Date()
      updates.employeeId = employeeId
    }

    if (status === 'COMPLETED' || status === 'CANCELLED' || status === 'NO_SHOW') {
      updates.actualEndTime = new Date()
    }

    return prisma.queue.update({
      where: { id: queueId },
      data: updates,
      include: {
        service: true,
        employee: true
      }
    })
  }

  static async reorderQueue(locationId: string) {
    const queue = await this.getCurrentQueue(locationId)
    
    // Reorder only waiting entries
    const waitingEntries = queue.filter(entry => entry.status === 'WAITING')
    
    // Update positions
    await Promise.all(
      waitingEntries.map((entry, index) => 
        prisma.queue.update({
          where: { id: entry.id },
          data: { position: index + 1 }
        })
      )
    )

    return this.getCurrentQueue(locationId)
  }
} 