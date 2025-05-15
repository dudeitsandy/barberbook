import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

interface BookingData {
  serviceId: string
  employeeId: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone?: string
}

export function useBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BookingData) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      toast.success('Booking created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
} 