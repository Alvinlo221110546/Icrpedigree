// Controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { createUser, findUserByUsername } from '../Models/authModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'icr_token';

// REGISTER
export const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'username & password required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await createUser(username, hash, role || 'user');
    res.json({ message: 'registered' });
  } catch (error) {
    res.status(400).json({ message: 'username exists or invalid' });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ message: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'invalid credentials' });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '6h' }
  );

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.json({
    message: 'ok',
    id: user.id,
    username: user.username,
    role: user.role
  });
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'logged out' });
};
