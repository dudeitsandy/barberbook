import { useState } from 'react'
import { useQueue } from '../hooks/useQueue'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const queueSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  customerName: z.string().min(1, 'Name is required'),
  customerPhone: z.string().optional(),
  notes: z.string().optional()
})

type QueueFormData = z.infer<typeof queueSchema>

export function QueueForm({ locationId }: { locationId: string }) {
  const { addToQueue } = useQueue(locationId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<QueueFormData>({
    resolver: zodResolver(queueSchema)
  })

  const onSubmit = async (data: QueueFormData) => {
    setIsSubmitting(true)
    try {
      await addToQueue.mutateAsync(data)
      reset() // Clear form on success
    } catch (error) {
      console.error('Error joining queue:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service
        </label>
        <select
          {...register('serviceId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a service</option>
          {/* Service options would be populated here */}
        </select>
        {errors.serviceId && (
          <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Your Name
        </label>
        <input
          type="text"
          {...register('customerName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number (optional)
        </label>
        <input
          type="tel"
          {...register('customerPhone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Joining Queue...' : 'Join Queue'}
        </button>
      </div>
    </form>
  )
}