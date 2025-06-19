import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

app.use(express.json());

// healthcheck route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
