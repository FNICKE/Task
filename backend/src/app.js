import express from 'express';
import cors from 'cors';
import { protect, adminOnly } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { getAllUsers } from './controllers/authController.js';

const app = express();

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    const allowedOrigins = [
      'https://your-app.vercel.app',
      'https://your-frontend-domain.com',
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  import('morgan')
    .then(m => app.use(m.default('dev')))
    .catch(() => {});
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', protect, taskRoutes);

// Admin route
app.get('/api/admin/users', protect, adminOnly, getAllUsers);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

export default app;