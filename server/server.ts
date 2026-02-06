/// <reference path="./types.d.ts" />
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';

import { baileysService } from './services/baileys.js';
import EventEmitter from 'events';
import * as process from 'process';

// Type assertion to ensure EventEmitter methods are available
const baileysServiceWithEvents = baileysService as any;
import { sessionRoutes } from './routes/session.js';
import { messagesRoutes } from './routes/messages.js';
import { chatsRoutes } from './routes/chats.js';
import authRoutes from './routes/auth.js';
import { requireAuth } from './services/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = (express as any)();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use((cors as any)());
app.use((express as any).json());
app.use((express as any).urlencoded({ extended: true }));

// Static files (React build)
app.use((express as any).static(join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', requireAuth, sessionRoutes);
app.use('/api/messages', requireAuth, messagesRoutes);
app.use('/api/chats', requireAuth, chatsRoutes);

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// SPA fallback - serve React index.html for non-API routes
app.get('*', (req: any, res: any) => {
  (res as any).sendFile(join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Forward Baileys events to connected clients
  baileysServiceWithEvents.on('qr_code', (qr) => {
    socket.emit('qr_code', qr);
  });

  baileysServiceWithEvents.on('connection_update', (update) => {
    socket.emit('connection_update', update);
  });

  baileysServiceWithEvents.on('message_upsert', (message) => {
    socket.emit('message_upsert', message);
  });

  baileysServiceWithEvents.on('chats_update', (chats) => {
    socket.emit('chats_update', chats);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  
  // Initialize Baileys service
  baileysService.initialize();
});

export { io };
