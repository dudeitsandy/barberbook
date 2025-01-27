// pages/api/test-auth.js
import { withAuth } from './auth/middleware'

async function handler(req, res) {
  // Should only reach here if authenticated
  res.status(200).json({ 
    message: 'Authenticated!',
    user: req.user // Should show user details from middleware
  })
}

export default withAuth(handler, true)