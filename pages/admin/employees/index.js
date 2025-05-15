// pages/admin/employees/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import AdminLayout from '../../../components/AdminLayout'

export default function EmployeeManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/business/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.role === 'BUSINESS') {
      fetchEmployees()
    }
  }, [session])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/business/employees')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to fetch employees')
      }
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      setError(error.message)
      console.error('Error fetching employees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (employeeId, newStatus) => {
    setUpdatingId(employeeId)
    try {
      const response = await fetch(`/api/business/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: newStatus }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update employee status')
      }
      
      await fetchEmployees() // Refresh the list
    } catch (error) {
      setError(error.message)
      console.error('Error updating employee status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  if (status === 'loading' || !session) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (session?.user?.role !== 'BUSINESS') {
    return <div className="text-red-500">Access denied. Business accounts only.</div>
  }

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your employees including their name, services, and status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/employees/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#0000FF] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Employee
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Services
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {employee.name}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                          {employee.email}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                          {employee.services?.length || 0} services
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            employee.active 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <Link
                            href={`/admin/employees/${employee.id}`}
                            className="text-[#0000FF] hover:text-blue-900 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleStatusChange(employee.id, !employee.active)}
                            disabled={updatingId === employee.id}
                            className={`text-[#0000FF] hover:text-blue-900 ${
                              updatingId === employee.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {updatingId === employee.id 
                              ? 'Updating...' 
                              : employee.active 
                                ? 'Deactivate' 
                                : 'Activate'
                            }
                          </button>
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-sm text-gray-500">
                          No employees found. Add your first employee to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}