import { render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Dashboard from '@/pages/admin/dashboard'
import { useQueue } from '@/hooks/useQueue'

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('@/hooks/useQueue')

describe('Admin Dashboard', () => {
  const mockSession = {
    data: {
      user: {
        id: '123',
        email: 'owner@allstarsmb.com',
        role: 'BUSINESS',
        businessId: 'business123'
      },
      expires: '1'
    },
    status: 'authenticated'
  }

  const mockQueue = {
    queue: [
      {
        id: '1',
        customerName: 'John Doe',
        service: { name: 'Haircut' },
        estimatedTime: new Date().toISOString(),
        status: 'WAITING'
      }
    ],
    isLoading: false,
    addToQueue: jest.fn(),
    updateStatus: { mutate: jest.fn() }
  }

  beforeEach(() => {
    ;(useSession as jest.Mock).mockReturnValue(mockSession)
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { locationId: 'location123' }
    })
    ;(useQueue as jest.Mock).mockReturnValue(mockQueue)
  })

  it('renders dashboard with queue information', async () => {
    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Current Queue')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Haircut')).toBeInTheDocument()
    })
  })

  it('redirects unauthorized users', () => {
    const mockUnauthSession = {
      data: null,
      status: 'unauthenticated'
    }
    ;(useSession as jest.Mock).mockReturnValue(mockUnauthSession)
    
    const mockRouter = {
      push: jest.fn(),
      query: {}
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    render(<Dashboard />)

    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login')
  })
}) 