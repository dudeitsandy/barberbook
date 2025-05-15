import { useQueue } from '@/hooks/useQueue'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const { locationId } = router.query
  const { queue, isLoading, addToQueue, updateStatus } = useQueue(locationId as string)

  // ... existing dashboard code ...

  return (
    <div>
      {/* ... existing dashboard content ... */}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Current Queue</h2>
        {isLoading ? (
          <div>Loading queue...</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {queue?.map((entry) => (
                <li key={entry.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{entry.customerName}</p>
                      <p className="text-sm text-gray-500">{entry.service.name}</p>
                      <p className="text-sm text-gray-500">
                        Estimated time: {new Date(entry.estimatedTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {entry.status === 'WAITING' && (
                        <button
                          onClick={() => updateStatus.mutate({
                            queueId: entry.id,
                            status: 'IN_SERVICE',
                            employeeId: entry.employeeId
                          })}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Start Service
                        </button>
                      )}
                      {entry.status === 'IN_SERVICE' && (
                        <button
                          onClick={() => updateStatus.mutate({
                            queueId: entry.id,
                            status: 'COMPLETED'
                          })}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 