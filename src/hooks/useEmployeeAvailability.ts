import { useQuery } from '@tanstack/react-query'

interface AvailabilityParams {
  employeeId: string
  date: string
}

export function useEmployeeAvailability({ employeeId, date }: AvailabilityParams) {
  return useQuery(
    ['employee', employeeId, 'availability', date],
    async () => {
      const response = await fetch(
        `/api/employees/${employeeId}/availability?date=${date}`
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    {
      enabled: Boolean(employeeId && date),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
} 