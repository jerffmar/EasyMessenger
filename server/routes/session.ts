import express from 'express';
import { baileysService } from '../services/baileys.js';

const router = express.Router();

// Initialize connection
router.post('/connect', async (req: any, res: any) => {
  try {
    await baileysService.initialize();
    res.json({ message: 'Connection initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize connection' });
  }
});

// Get QR code
router.get('/qr', async (req: any, res: any) => {
  try {
    const status = await baileysService.getConnectionStatus();
    if (status.connected) {
      res.json({ qr: null, connected: true });
    } else {
      // Return the current QR code if available
      const currentQR = baileysService.getCurrentQRCode();
      res.json({ 
        qr: currentQR || 'pending', 
        connected: false 
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

// Get session status
router.get('/status', async (req: any, res: any) => {
  try {
    const status = await baileysService.getConnectionStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session status' });
  }
});

// Logout from session
router.post('/logout', async (req: any, res: any) => {
  try {
    await baileysService.logout();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Set webhook URL
router.post('/webhook', (req: any, res: any) => {
  try {
    const { url } = req.body;
    baileysService.setWebhook(url || null);
    res.json({ message: 'Webhook updated successfully', url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set webhook' });
  }
});

export { router as sessionRoutes };
