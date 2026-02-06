// Generate a random 32-character password with letters and numbers
export function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  for (let i = 0; i < 32; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

// Store the password (in production, this should be in environment variables or secure storage)
let currentPassword: string | null = null;

export function initializeAuth(): string {
  // Check if password is already set in environment
  try {
    // Safe access to process.env
    const g = globalThis as any;
    if (g && g.process && g.process.env && g.process.env.API_PASSWORD) {
      currentPassword = g.process.env.API_PASSWORD;
      console.log('🔐 Using password from environment variables');
      if (currentPassword) return currentPassword;
    }
  } catch (error) {
    // Process not available, continue with generated password
  }
  
  // Generate new password
  currentPassword = generateSecurePassword();
  
  // Log the password for deployment
  console.log('='.repeat(60));
  console.log('🔐 EASYMESSENGER LOGIN PASSWORD');
  console.log('='.repeat(60));
  console.log(`Password: ${currentPassword}`);
  console.log('='.repeat(60));
  console.log('⚠️  SAVE THIS PASSWORD - IT WILL NOT BE SHOWN AGAIN');
  console.log('📝 This password is also your API Key for external services');
  console.log('='.repeat(60));
  
  return currentPassword!;
}

export function validatePassword(password: string): boolean {
  return currentPassword === password;
}

export function getCurrentPassword(): string | null {
  return currentPassword;
}

// Middleware to check authentication
export function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header required' });
  }
  
  // Extract password from "Bearer <password>" or just the password
  const password = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
  
  if (!validatePassword(password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  
  next();
}
