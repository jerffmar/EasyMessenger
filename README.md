# EasyMessenger

A powerful WhatsApp management application built with Baileys library, featuring a modern React frontend and Node.js backend for seamless WhatsApp Web automation and messaging.

## 🚀 Features

### Core Functionality
- **WhatsApp Web Integration**: Full WhatsApp Web connectivity using Baileys library
- **Real-time Communication**: Socket.io based real-time messaging and status updates
- **Modern Web Interface**: React-based responsive UI with Tailwind CSS
- **Session Management**: Persistent authentication and session handling
- **Message Handling**: Send, receive, and manage WhatsApp messages
- **Chat Management**: Browse and interact with WhatsApp chats
- **Media Support**: Handle images, videos, audio, and documents
- **QR Code Authentication**: Easy WhatsApp pairing with QR codes

### Technical Features
- **TypeScript**: Full TypeScript support for type safety
- **RESTful API**: Clean API endpoints for all WhatsApp operations
- **Real-time Events**: Live updates for messages, connection status, and more
- **Logging**: Comprehensive logging with Pino logger
- **Environment Configuration**: Flexible environment-based configuration
- **Health Monitoring**: Built-in health check endpoints

## 📋 Prerequisites

- **Node.js**: >= 20.0.0
- **npm** or **yarn**: Package manager
- **WhatsApp Account**: For authentication and usage

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EasyMessenger
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Go back to root
cd ..
```

### 3. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Session configuration
SESSION_PATH=./auth_info

# Server configuration
PORT=3001
NODE_ENV=development

# Webhook configuration (optional)
WEBHOOK_URL=

# Logging
LOG_LEVEL=info
```

## 🚀 Quick Start

### Development Mode
Start both server and client in development mode:
```bash
npm run dev
```
This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:5173`

### Individual Services
Start only the backend server:
```bash
npm run server:dev
```

Start only the frontend client:
```bash
npm run client:dev
```

### Production Build
Build the application for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 📁 Project Structure

```
EasyMessenger/
├── client/                 # React frontend application
│   ├── src/               # React source code
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── server/                # Node.js backend server
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── server.ts         # Main server file
│   └── tsconfig.json     # TypeScript configuration
├── src/                  # Baileys library source
├── Example/              # Example implementations
├── WAProto/              # Protocol buffer definitions
├── Media/                # Media files for testing
├── .env.example          # Environment configuration template
├── app-package.json      # Application dependencies
├── package.json          # Root package configuration
└── README.md            # This file
```

## 🔧 API Endpoints

### Session Management
- `GET /api/session/status` - Get connection status
- `POST /api/session/connect` - Initialize WhatsApp connection
- `POST /api/session/disconnect` - Disconnect from WhatsApp
- `GET /api/session/qr` - Get QR code for pairing

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages/send` - Send a message
- `GET /api/messages/:id` - Get specific message

### Chats
- `GET /api/chats` - Get all chats
- `GET /api/chats/:id` - Get specific chat
- `GET /api/chats/:id/messages` - Get chat messages

### Health Check
- `GET /health` - Server health status

## 🎯 Usage Examples

### Basic Connection
```typescript
import { baileysService } from './services/baileys';

// Start WhatsApp connection
await baileysService.connect();

// Send a message
await baileysService.sendMessage('phone-number@s.whatsapp.net', 'Hello World!');
```

### Using the Frontend
1. Open `http://localhost:5173` in your browser
2. Scan the QR code with WhatsApp
3. Start managing your WhatsApp messages

### Running the Example
```bash
npm run example
```

## 🔌 Socket.io Events

### Client to Server
- `connect` - Initialize connection
- `disconnect` - Close connection
- `send_message` - Send a message

### Server to Client
- `qr` - QR code for pairing
- `connection.update` - Connection status updates
- `messages.upsert` - New messages
- `chats.update` - Chat updates
- `presence.update` - Online status updates

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# End-to-end tests
npm run test:e2e
```

### Linting
```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📝 Configuration

### Environment Variables
- `SESSION_PATH`: Path to store authentication files
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `WEBHOOK_URL`: Optional webhook URL for notifications
- `LOG_LEVEL`: Logging level (trace/debug/info/warn/error/fatal)

### WhatsApp Features Supported
- ✅ Text messages
- ✅ Media messages (images, videos, audio, documents)
- ✅ Voice messages
- ✅ Stickers
- ✅ Contacts
- ✅ Location sharing
- ✅ Polls
- ✅ Status updates
- ✅ Group management
- ✅ Broadcast lists
- ✅ Message reactions
- ✅ Message deletion
- ✅ Read receipts

## 🚧 Current Limitations

- Single WhatsApp account per instance
- No multi-device support beyond WhatsApp's native limits
- Rate limiting applies as per WhatsApp's policies
- Some advanced WhatsApp features may not be fully implemented

## 🗺️ Roadmap & TODO

### High Priority
- [ ] **Multi-Session Support**: Manage multiple WhatsApp accounts
- [ ] **Message Scheduling**: Schedule messages to be sent later
- [ ] **Contact Management**: Advanced contact organization
- [ ] **Message Templates**: Predefined message templates
- [ ] **File Upload Interface**: Better media upload handling

### Medium Priority
- [ ] **Analytics Dashboard**: Message statistics and analytics
- [ ] **Webhook Management**: Configure multiple webhooks
- [ ] **Backup & Restore**: Session backup functionality
- [ ] **Message Search**: Advanced search capabilities
- [ ] **Group Management UI**: Enhanced group controls

### Low Priority
- [ ] **Themes System**: Custom UI themes
- [ ] **Mobile App**: React Native mobile application
- [ ] **API Rate Limiting**: Built-in rate limiting controls
- [ ] **Message Encryption**: Additional encryption layer
- [ ] **Integration Plugins**: Third-party service integrations

### Future Implementation Suggestions
- **Bot Framework**: Built-in chatbot capabilities with AI integration
- **CRM Integration**: Connect with popular CRM systems
- **E-commerce Integration**: WhatsApp shopping features
- **Multi-language Support**: Internationalization and localization
- **Cloud Deployment**: Docker containers and cloud deployment guides
- **Monitoring Dashboard**: Real-time monitoring and alerting
- **API Documentation**: Interactive API documentation (Swagger/OpenAPI)
- **Message Automation**: Rule-based message automation
- **Voice/Video Calls**: Integration for WhatsApp calls
- **Status Stories**: View and manage WhatsApp status updates

## 🚀 Deployment

### Render Deployment

Render is a recommended platform for deploying EasyMessenger. Follow these steps for a successful deployment:

#### Prerequisites
- Render account (free tier available)
- GitHub repository with your EasyMessenger code
- WhatsApp account for testing

#### Step 1: Prepare Your Repository
1. Push your code to a GitHub repository
2. Ensure your `render.yaml` file is committed (included in this project)

#### Step 2: Create Single Render Service

**Combined Backend + Frontend Service (Web Service)**
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure the service:

**Build Command:**
```bash
npm install && cd client && npm install && cd .. && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```env
# Node.js Environment
NODE_ENV=production
PORT=10000

# Session Configuration
SESSION_PATH=/opt/render/project/src/auth_info

# Frontend Configuration (for production)
VITE_API_URL=""
VITE_SOCKET_URL=""

# Logging
LOG_LEVEL=info

# Optional: Webhook Configuration
WEBHOOK_URL=

# Optional: Advanced Configuration
ADV_SECRET_KEY=
SOCKET_URL=
```

**Service Configuration:**
- **Runtime**: Node 20 (or latest)
- **Region**: Choose nearest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `.` (project root)
- **Instance Type**: Free (for testing) or Standard

**Health Check Path:**
```
/health
```

**Auto-Deploy**: Enable for automatic deployments on push

**How it works:**
- The backend serves the API on port 10000
- The built frontend files are served from `/public` directory
- All requests to the root domain serve the React app
- API requests to `/api/*` are handled by the backend
- Socket.io connections work seamlessly on the same domain

#### Step 3: Configure CORS and Networking

**Update Backend CORS Settings:**
In your backend code, ensure CORS allows the same domain (since both frontend and backend are on the same service):
```typescript
app.use(cors({
  origin: ['https://your-service-name.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
```

**Update Frontend API Configuration:**
In your client code, use relative URLs since both frontend and backend are on the same domain:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';
```

**For Development:**
Set these environment variables in your `.env` file:
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

**For Production on Render:**
Set these in your Render service environment:
```env
VITE_API_URL=
VITE_SOCKET_URL=
```
(Empty strings will use relative URLs, which work correctly in production)

#### Step 4: Persistent Storage

**For Session Persistence:**
Render's free tier doesn't include persistent storage. For production:
1. Use Render Disks for persistent `/opt/render/project/src/auth_info`
2. Or implement cloud storage (AWS S3, Google Cloud Storage)

**Alternative: Use Environment Variables for Critical Data**
```env
# Store critical session data in environment if needed
SESSION_BACKUP_URL=
```

#### Step 5: Custom Domain (Optional)

**Single Service Domain:**
- Go to your Web Service → Custom Domains
- Add your custom domain (e.g., `app.yourdomain.com` or `whatsapp.yourdomain.com`)
- Update DNS records as instructed by Render
- Both frontend and backend will be accessible on the same domain
- API endpoints will be available at `https://yourdomain.com/api/*`

#### Step 6: SSL and Security

- SSL certificates are automatically provided by Render
- Ensure your environment variables are set correctly

#### Troubleshooting Common Issues

**Build Failures:**
```bash
# Check build logs for specific errors
# Common issues:
# - Missing dependencies: Ensure package.json is correct
# - TypeScript errors: Run `npm run lint` locally first
# - Memory issues: Upgrade to a larger instance type
```

**Runtime Errors:**
```bash
# Check service logs
# Common issues:
# - Port conflicts: Ensure PORT environment variable is set to 10000
# - Permission issues: Check file permissions for auth_info directory
# - CORS errors: Verify frontend URL is in CORS allowlist
```

**WhatsApp Connection Issues:**
```bash
# Common issues:
# - Session loss: Implement persistent storage
# - QR code not generating: Check logs for authentication errors
# - Connection timeouts: Ensure proper network configuration
```

#### Production Optimization

**Performance Tuning:**
```env
# Enable production optimizations
NODE_ENV=production
LOG_LEVEL=warn

# Reduce memory usage
NODE_OPTIONS="--max-old-space-size=512"
```

**Monitoring:**
- Use Render's built-in metrics
- Set up alerting for downtime
- Monitor WhatsApp connection status

**Scaling:**
- Start with free tier for testing
- Upgrade to Standard instances for production
- Consider horizontal scaling for high traffic

#### Alternative Deployment Methods

**Docker Deployment:**
```dockerfile
# Dockerfile example
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

**Manual VPS Deployment:**
```bash
# On your server
git clone <repository>
cd EasyMessenger
npm install
npm run build
pm2 start ecosystem.config.js
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is for educational and personal use only. Please respect WhatsApp's Terms of Service and use responsibly. The developers are not responsible for any misuse of this software.

## 🙏 Acknowledgments

- **Baileys**: The core WhatsApp Web library that makes this possible
- **WhatsApp**: For the amazing messaging platform
- **React Community**: For the excellent frontend framework
- **Node.js Community**: For the robust backend ecosystem

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ using Baileys, React, and Node.js**