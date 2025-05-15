import { withAuth, withBusinessAuth } from '@/middleware/withAuth'
import { getSession } from 'next-auth/react'
import { createMocks } from 'node-mocks-http'

jest.mock('next-auth/react')

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('withAuth', () => {
    it('allows authenticated users', async () => {
      const { req, res } = createMocks({
        method: 'GET'
      })

      const mockSession = {
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'BUSINESS'
        }
      }
      ;(getSession as jest.Mock).mockResolvedValue(mockSession)

      const handler = jest.fn()
      await withAuth(handler)(req, res)

      expect(handler).toHaveBeenCalled()
      expect(req.user).toEqual(mockSession.user)
    })

    it('rejects unauthenticated users', async () => {
      const { req, res } = createMocks({
        method: 'GET'
      })

      ;(getSession as jest.Mock).mockResolvedValue(null)

      const handler = jest.fn()
      await withAuth(handler)(req, res)

      expect(handler).not.toHaveBeenCalled()
      expect(res._getStatusCode()).toBe(401)
    })
  })

  describe('withBusinessAuth', () => {
    it('allows business users', async () => {
      const { req, res } = createMocks({
        method: 'GET'
      })

      const mockSession = {
        user: {
          id: '123',
          email: 'business@example.com',
          role: 'BUSINESS'
        }
      }
      ;(getSession as jest.Mock).mockResolvedValue(mockSession)

      const handler = jest.fn()
      await withBusinessAuth(handler)(req, res)

      expect(handler).toHaveBeenCalled()
    })

    it('rejects non-business users', async () => {
      const { req, res } = createMocks({
        method: 'GET'
      })

      const mockSession = {
        user: {
          id: '123',
          email: 'customer@example.com',
          role: 'CUSTOMER'
        }
      }
      ;(getSession as jest.Mock).mockResolvedValue(mockSession)

      const handler = jest.fn()
      await withBusinessAuth(handler)(req, res)

      expect(handler).not.toHaveBeenCalled()
      expect(res._getStatusCode()).toBe(403)
    })
  })
}) 