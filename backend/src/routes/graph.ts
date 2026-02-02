import { Router, Request, Response } from 'express';
import { FileService } from '../services/fileService';

const router = Router();
const fileService = new FileService();

// Get graph data
router.get('/', async (req: Request, res: Response) => {
  try {
    const graphData = await fileService.getGraphData();
    res.json(graphData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graph data' });
  }
});

export default router;