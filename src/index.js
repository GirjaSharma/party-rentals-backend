import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard.routes.js';
import prisma from './db/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Your Party Rental app is running.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running.' });
});

app.get('/api/db-health', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ status: 'ok', dbTime: result[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is successfully listening on http://localhost:${PORT}`);
});
