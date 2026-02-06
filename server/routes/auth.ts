import express from 'express';
import { initializeAuth, validatePassword } from '../services/auth.js';

const router = express.Router();

// Initialize authentication on server start
const systemPassword = initializeAuth();

// Login endpoint
router.post('/login', (req: any, res: any) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ 
      error: 'Password is required',
      success: false 
    });
  }
  
  if (validatePassword(password)) {
    return res.json({
      success: true,
      message: 'Authentication successful',
      token: password // In production, use JWT or similar
    });
  } else {
    return res.status(401).json({
      error: 'Invalid password',
      success: false
    });
  }
});

// Check authentication status
router.get('/status', (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.json({ authenticated: false });
  }
  
  const password = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
  
  const isValid = validatePassword(password);
  
  return res.json({ 
    authenticated: isValid,
    passwordSet: !!systemPassword
  });
});

export default router;
