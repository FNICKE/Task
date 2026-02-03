import pool from '../config/db.js';

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description || null, status || 'pending', priority || 'medium', due_date || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Task created' });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }

    const { title, description, status, priority, due_date } = req.body;

    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?',
      [title || tasks[0].title, description, status || tasks[0].status, priority || tasks[0].priority, due_date, taskId]
    );

    res.json({ message: 'Task updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};