import express from 'express';
import { baileysService } from '../services/baileys.js';

const router = express.Router();

// Get all chats
router.get('/', async (req: any, res: any) => {
  try {
    const chats = baileysService.getChats();
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get messages from specific chat
router.get('/:id/messages', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!id) {
      return res.status(400).json({ 
        error: 'Chat ID is required' 
      });
    }

    const messages = await baileysService.getChatMessages(id, limit);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as chatsRoutes };
