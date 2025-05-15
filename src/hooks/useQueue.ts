import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useQueue(locationId: string) {
  const queryClient = useQueryClient()

  const { data: queue, isLoading } = useQuery(
    ['queue', locationId],
    async () => {
      const response = await fetch(`/api/locations/${locationId}/queue`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  const addToQueue = useMutation(
    async (data: {
      serviceId: string
      customerName: string
      customerPhone?: string
      notes?: string
    }) => {
      const response = await fetch(`/api/locations/${locationId}/queue`, {
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
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['queue', locationId])
        toast.success('Added to queue successfully')
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    }
  )

  const updateStatus = useMutation(
    async ({
      queueId,
      status,
      employeeId,
    }: {
      queueId: string
      status: string
      employeeId?: string
    }) => {
      const response = await fetch(`/api/locations/${locationId}/queue/${queueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, employeeId }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['queue', locationId])
        toast.success('Queue updated successfully')
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    }
  )

  return {
    queue,
    isLoading,
    addToQueue,
    updateStatus,
  }
} 