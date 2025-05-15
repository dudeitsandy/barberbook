import { useBooking } from '@/hooks/useBooking'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define the schema
const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  employeeId: z.string().min(1, 'Please select a provider'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Please enter a valid email'),
  customerPhone: z.string().optional(),
  notes: z.string().optional()
})

// Define the type from the schema
type BookingFormData = z.infer<typeof bookingSchema>

export default function BookingForm() {
  const { createBooking } = useBooking()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  })

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      await createBooking(data)
      // Handle success
    } catch (err) {
      // Handle error
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields would go here */}
      <div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded"
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </form>
  )
}