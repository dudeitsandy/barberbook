import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoginPage from '@/pages/auth/login'

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

describe('Login Page', () => {
  const mockRouter = {
    push: jest.fn(),
    query: {}
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(signIn as jest.Mock).mockClear()
    mockRouter.push.mockClear()
  })

  it('handles business login successfully', async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
      error: null
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'owner@allstarsmb.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'business123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'owner@allstarsmb.com',
        password: 'business123',
        redirect: false
      })
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/dashboard')
    })
  })

  it('displays error message on failed login', async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: 'Invalid credentials'
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@email.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
}) 