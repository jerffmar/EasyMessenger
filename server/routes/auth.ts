import { Router, Request, Response } from 'express';
import { initializeAuth, validatePassword } from '../services/auth';

const router = Router();

// Initialize authentication on server start
const systemPassword = initializeAuth();

// Login endpoint
router.post('/login', (req: Request, res: Response) => {
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
router.get('/status', (req: Request, res: Response) => {
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
