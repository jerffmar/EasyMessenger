// Generate a random 32-character password with letters and numbers
function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  for (let i = 0; i < 32; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

// Store password (in production, this should be in environment variables or secure storage)
let currentPassword = null;

function initializeAuth() {
  // Check if password is already set in environment
  try {
    if (process.env && process.env.API_PASSWORD) {
      currentPassword = process.env.API_PASSWORD;
      console.log('🔐 Using password from environment variables');
      return currentPassword;
    }
  } catch (error) {
    // Process not available, continue with generated password
  }
  
  // Generate new password
  currentPassword = generateSecurePassword();
  
  // Log password for deployment
  console.log('='.repeat(60));
  console.log('🔐 EASYMESSENGER LOGIN PASSWORD');
  console.log('='.repeat(60));
  console.log(`Password: ${currentPassword}`);
  console.log('='.repeat(60));
  console.log('⚠️  SAVE THIS PASSWORD - IT WILL NOT BE SHOWN AGAIN');
  console.log('📝 This password is also your API Key for external services');
  console.log('='.repeat(60));
  
  return currentPassword;
}

function validatePassword(password) {
  return currentPassword === password;
}

function getCurrentPassword() {
  return currentPassword;
}

// Middleware to check authentication
function requireAuth(req, res, next) {
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

module.exports = {
  generateSecurePassword,
  initializeAuth,
  validatePassword,
  getCurrentPassword,
  requireAuth
};
