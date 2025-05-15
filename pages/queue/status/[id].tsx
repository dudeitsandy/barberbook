import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

export default function QueueStatus() {
  const router = useRouter()
  const { id } = router.query

  const { data: queueEntry, isLoading } = useQuery(
    ['queue-entry', id],
    async () => {
      const response = await fetch(`/api/queue/${id}`)
      if (!response.ok) throw new Error('Failed to fetch queue status')
      return response.json()
    },
    {
      enabled: !!id,
      refetchInterval: 30000 // Refetch every 30 seconds
    }
  )

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Queue Status</h1>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Position</p>
          <p className="text-xl font-semibold">{queueEntry.position}</p>
        </div>

        <div>
          <p className="text-gray-600">Estimated Time</p>
          <p className="text-xl font-semibold">
            {new Date(queueEntry.estimatedTime).toLocaleTimeString()}
          </p>
        </div>

        <div>
          <p className="text-gray-600">Status</p>
          <p className="text-xl font-semibold">{queueEntry.status}</p>
        </div>

        {queueEntry.employee && (
          <div>
            <p className="text-gray-600">Service Provider</p>
            <p className="text-xl font-semibold">{queueEntry.employee.name}</p>
          </div>
        )}
      </div>
    </div>
  )
} 