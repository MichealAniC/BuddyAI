import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import moodRoutes from './routes/mood.routes';
import assessmentRoutes from './routes/assessment.routes';
import chatRoutes from './routes/chat.routes';
import riskRoutes from './routes/risk.routes';
import alertRoutes from './routes/alert.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/conversations', chatRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`BuddyAI server running on port ${config.port}`);
});
