import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const register = async (req, res) => {
  try {
    let { name, email, password, role = 'user' } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const normalizedRole = role.trim().toLowerCase();
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: `Invalid role. Allowed: ${validRoles.join(', ')}` });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, normalizedRole]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: result.insertId, name, email, role: normalizedRole },
    });
  } catch (error) {
    let status = 500;
    let message = 'Server error during registration';

    if (error.code === 'ER_DUP_ENTRY') {
      status = 409;
      message = 'Email is already registered';
    } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE' || error.code === 'ER_WARN_DATA_OUT_OF_RANGE') {
      status = 400;
      message = 'Invalid value provided (likely role field mismatch)';
    } else if (error.code?.startsWith('ER_')) {
      message = 'Database operation failed';
    }

    res.status(status).json({ success: false, message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.created_at },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};