import express from 'express';
import { protect } from '../middleware/auth.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.use(protect); // all task routes require authentication

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

export default router;