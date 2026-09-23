import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard.routes.js';

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

app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is successfully listening on http://localhost:${PORT}`);
});
