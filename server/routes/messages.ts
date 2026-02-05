import { Router, Request, Response } from 'express';
import { baileysService } from '../services/baileys.js';

const router = Router();

// Send text message
router.post('/text', async (req: Request, res: Response) => {
  try {
    const { number, text } = req.body;

    if (!number || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields: number and text' 
      });
    }

    // Clean number (remove non-digits)
    const cleanNumber = number.replace(/\D/g, '');
    
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      return res.status(400).json({ 
        error: 'Invalid phone number format' 
      });
    }

    const result = await baileysService.sendMessage(cleanNumber, text);
    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: result 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as messagesRoutes };
