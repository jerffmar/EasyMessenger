const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { join } = require('path');
const { fileURLToPath } = require('url');

// Import auth
const { initializeAuth, requireAuth } = require('./services/auth');

// Initialize authentication
initializeAuth();

// Import routes (these will need to be converted to JS)
// For now, let's create basic routes inline

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (React build)
app.use(express.static(join(__dirname, 'public')));

// Basic auth routes
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  
  // This is a simple implementation - in production use proper validation
  if (password && password.length === 32) {
    return res.json({
      success: true,
      message: 'Authentication successful',
      token: password
    });
  }
  
  return res.status(401).json({
    error: 'Invalid password',
    success: false
  });
});

app.get('/api/auth/status', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.json({ authenticated: false });
  }
  
  const password = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
  
  const isValid = password && password.length === 32;
  
  return res.json({ 
    authenticated: isValid,
    passwordSet: true
  });
});

// Protected routes (placeholder)
app.get('/api/session/status', requireAuth, (req, res) => {
  res.json({ connected: false, user: null });
});

app.get('/api/session/qr', requireAuth, (req, res) => {
  res.json({ qr: 'pending', connected: false });
});

app.post('/api/session/connect', requireAuth, (req, res) => {
  res.json({ message: 'Connection initialized successfully' });
});

app.get('/api/chats', requireAuth, (req, res) => {
  res.json([]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('Client connected to socket.io');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from socket.io');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
