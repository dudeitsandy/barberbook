import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { withAuth } from '@/middleware/withAuth'
import { PrismaClient } from '@prisma/client'
import { parse } from 'date-fns'

type BookingData = {
  serviceId: string
  employeeId: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  notes?: string
}

export function useBooking() {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (data: BookingData) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create booking')
      }
      
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings'])
        toast.success('Booking created successfully!')
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to create booking')
      },
    }
  )
}

const formatDuration = (minutes) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h${remainingMinutes ? ` ${remainingMinutes}min` : ''}`
  }
  return `${minutes}min`
} 