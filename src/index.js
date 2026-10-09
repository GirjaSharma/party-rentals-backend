import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes.js';
import businessesRoutes from './routes/businesses.routes.js';
import prisma from './db/prisma.js';
import {checkJwt, attachUser, requireBusiness} from './middleware/auth.js'
import {getBookings} from './controllers/bookings.controller.js'


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

app.get('/api/auth/me', checkJwt, attachUser, (req, res) =>{
    res.json({user: req.dbUser, memberships: req.memberships});
});

app.use('/api/businesses', businessesRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is successfully listening on http://localhost:${PORT}`);
});
