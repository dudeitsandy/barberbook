import { QueueService } from '@/services/queueService'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/utils/errors'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    queue: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    },
    service: {
      findUnique: jest.fn()
    }
  }
}))

describe('QueueService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCurrentQueue', () => {
    it('returns current queue for location', async () => {
      const mockQueue = [
        {
          id: '1',
          customerName: 'John Doe',
          status: 'WAITING'
        }
      ]
      ;(prisma.queue.findMany as jest.Mock).mockResolvedValue(mockQueue)

      const result = await QueueService.getCurrentQueue('location123')
      expect(result).toEqual(mockQueue)
      expect(prisma.queue.findMany).toHaveBeenCalled()
    })
  })

  describe('addToQueue', () => {
    it('adds new entry to queue', async () => {
      const mockService = {
        id: 'service123',
        duration: 30
      }
      ;(prisma.service.findUnique as jest.Mock).mockResolvedValue(mockService)
      ;(prisma.queue.findFirst as jest.Mock).mockResolvedValue(null)
      
      const mockQueueEntry = {
        id: '1',
        position: 1,
        customerName: 'John Doe'
      }
      ;(prisma.queue.create as jest.Mock).mockResolvedValue(mockQueueEntry)

      const result = await QueueService.addToQueue({
        locationId: 'location123',
        serviceId: 'service123',
        customerName: 'John Doe'
      })

      expect(result).toEqual(mockQueueEntry)
      expect(prisma.queue.create).toHaveBeenCalled()
    })

    it('throws error if service not found', async () => {
      ;(prisma.service.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(
        QueueService.addToQueue({
          locationId: 'location123',
          serviceId: 'invalid',
          customerName: 'John Doe'
        })
      ).rejects.toThrow(AppError)
    })
  })
}) 