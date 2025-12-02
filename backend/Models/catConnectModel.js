import { pool } from "../Config/db.js";

/* ============================================================
   CREATE TABLES (AUTO ON SERVER START)
============================================================ */

export const createUserProfileTableIfNotExists = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNIQUE,
      full_name VARCHAR(128) NOT NULL,
      phone_number VARCHAR(32),
      email VARCHAR(128),
      address TEXT,
      photo_url VARCHAR(512),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.query(sql);
  console.log("👤 user_profiles table ready");
};

/* ============================================================
   INIT FUNCTION (RUN ALL)
============================================================ */
export const initPedigreeConnectTables = async () => {
  await createUserProfileTableIfNotExists();
  console.log("📦 ALL Pedigree Connect Tables Initialized");
};

/* ============================================================
   USER PROFILE FUNCTIONS
============================================================ */

export const createUserProfile = async (data) => {
  const { user_id, full_name, phone_number, email, address, photo_url } = data;

  const [result] = await pool.execute(
    `INSERT INTO user_profiles (user_id, full_name, phone_number, email, address, photo_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, full_name, phone_number, email, address, photo_url]
  );

  return result.insertId;
};

export const getProfileByUserId = async (user_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM user_profiles WHERE user_id=?`,
    [user_id]
  );
  return rows[0] || null;
};

/* ============================================================
   UPDATE USER PROFILE (PUT REQUEST)
============================================================ */

export const updateUserProfile = async (user_id, data) => {
  const { full_name, phone_number, email, address, photo_url } = data;

  const [result] = await pool.execute(
    `UPDATE user_profiles
     SET full_name=?, phone_number=?, email=?, address=?, photo_url=?
     WHERE user_id=?`,
    [full_name, phone_number, email, address, photo_url, user_id]
  );

  return result;
};
