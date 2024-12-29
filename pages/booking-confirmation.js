// pages/booking-confirmation.js
import { useRouter } from 'next/router'

export default function BookingConfirmation() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Booking Confirmed!
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            You will receive a confirmation email shortly with your booking details.
          </p>

          <button
            onClick={() => router.push('/')}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}