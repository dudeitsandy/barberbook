import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from '@/middleware/withAuth'
import { EmployeeService } from '@/services/employeeService'
import { errorHandler } from '@/utils/errors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, date } = req.query

    if (!id || !date || Array.isArray(id) || Array.isArray(date)) {
      return res.status(400).json({ message: 'Invalid parameters' })
    }

    const availability = await EmployeeService.getEmployeeAvailability(id, date)
    return res.status(200).json(availability)
  } catch (error) {
    const { statusCode, body } = errorHandler(error)
    return res.status(statusCode).json(body)
  }
}

export default withAuth(handler) 