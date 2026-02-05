// Simple test to verify TypeScript compilation
import express from 'express';
import { baileysService } from './server/services/baileys.js';

const app = express();
const PORT = 3001;

app.get('/test', (req: express.Request, res: express.Response) => {
  res.json({ status: 'TypeScript compilation test passed' });
});

app.listen(PORT, () => {
  console.log('Test server running on port', PORT);
});
