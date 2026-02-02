import express from 'express';
import cors from 'cors';
import path from 'path';
import notesRouter from './routes/notes';
import graphRouter from './routes/graph';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRouter);
app.use('/api/graph', graphRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🧠 Second Brain API running on port ${PORT}`);
  console.log(`📚 Data directory: ${path.join(__dirname, '../data/notes')}`);
});