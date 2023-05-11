import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import mongoose from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const uri = process.env.MONGODB_URI || ''


async function connect() {
  try {
    await mongoose.connect(uri);
    console.info('Connected to mongoose');
  } catch (error) {
    console.error('ERR:: ', error)
  }
}
connect().then(() => {
  app.listen(port, () => {
    console.log(`[⚡️]: Server is running at ${process.env.HOST}:${port}`);
  })
});
