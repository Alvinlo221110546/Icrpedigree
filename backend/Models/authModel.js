// Models/userModel.js
import { pool } from '../Config/db.js';

// Create table
export const createUsersTableIfNotExists = async () => {
  const sql = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.query(sql);
};

// Insert user
export const createUser = async (username, hash, role) => {
  return pool.execute(
    `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
    [username, hash, role]
  );
};

// Find user by username
export const findUserByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT id, username, password_hash, role FROM users WHERE username=?`,
    [username]
  );
  return rows[0];
};

