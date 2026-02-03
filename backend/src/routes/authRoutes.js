// src/routes/authRoutes.js
import express from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (require valid JWT)
router.get('/me', protect, getMe);

// Admin-only routes
router.get('/admin/users', protect, adminOnly, getAllUsers);

export default router;