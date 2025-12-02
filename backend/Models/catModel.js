// src/Models/catModel.js
import { pool } from '../Config/db.js';
import { encryptText, decryptText } from '../Middleware/encrypt.js';
import crypto from 'crypto';

const sha256 = (input) =>
  crypto.createHash('sha256').update(String(input || "")).digest("hex");

/* ============================================================
   CREATE TABLES
============================================================ */
export const createCatsTableIfNotExists = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS cats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unique_code VARCHAR(64) UNIQUE,
      cat_name TEXT NOT NULL,
      species VARCHAR(64) DEFAULT 'Cat',
      breed TEXT,
      birth_date VARCHAR(128),
      gender ENUM('male','female') DEFAULT 'male',
      sire_id INT NULL,
      dam_id INT NULL,
      breeder TEXT,
      pedigree_number VARCHAR(128),
      notes TEXT,
      profile_image_url VARCHAR(512),
      profile_image_public_id VARCHAR(256),
      pedigree_hash VARCHAR(128),
      previous_hash VARCHAR(128),
      current_hash VARCHAR(128),
      user_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_sire FOREIGN KEY (sire_id) REFERENCES cats(id) ON DELETE SET NULL,
      CONSTRAINT fk_dam FOREIGN KEY (dam_id) REFERENCES cats(id) ON DELETE SET NULL,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.query(sql);
  console.log("🐱 cats table ready with FK -> users");
};

export const createPedigreeScanTableIfNotExists = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS pedigree_scans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cat_id INT,
      scan_image VARCHAR(512),
      extracted_text LONGTEXT,
      icr_status ENUM('pending','success','failed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.query(sql);
  console.log("📄 pedigree_scans table ready");
};

export const createCatHistoryTableIfNotExists = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS cat_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cat_id INT,
      action ENUM('create','update','delete') NOT NULL,
      changes JSON,
      previous_hash VARCHAR(128),
      current_hash VARCHAR(128),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.query(sql);
  console.log("📜 cat_history table ready");
};

/* ============================================================
   HASH GENERATOR
============================================================ */
const generatePedigreeHash = ({
  cat_name,
  birth_date,
  sire_id,
  dam_id,
  unique_code
}) => {
  const raw = `${cat_name || ""}|${birth_date || ""}|${sire_id || ""}|${
    dam_id || ""
  }|${unique_code || ""}`;
  return sha256(raw);
};

const generateCurrentHash = ({
  cat_name,
  breed,
  birth_date,
  gender,
  sire_id,
  dam_id,
  breeder,
  pedigree_number,
  notes,
  previous_hash
}) => {
  const raw = [
    cat_name || "",
    "Cat",
    breed || "",
    birth_date || "",
    gender || "",
    sire_id || "",
    dam_id || "",
    breeder || "",
    pedigree_number || "",
    notes || "",
    previous_hash || "",
    Date.now()
  ].join("|");

  return sha256(raw);
};

const getLastCurrentHash = async (cat_id) => {
  const [rows] = await pool.query(
    `SELECT current_hash FROM cat_history WHERE cat_id=? ORDER BY id DESC LIMIT 1`,
    [cat_id]
  );
  return rows.length ? rows[0].current_hash : null;
};

/* ============================================================
   INSERT CAT  (SUDAH DIPERBAIKI)
============================================================ */
export const insertCat = async ({
  unique_code = null,
  cat_name,
  breed = null,
  birth_date = null,
  gender = 'male',
  sire_id = null,
  dam_id = null,
  breeder = null,
  pedigree_number = null,
  notes = null,
  profile_image_url = null,
  profile_image_public_id = null,
  user_id = null
}) => {

  // Encrypt fields
  const encName = encryptText(cat_name);
  const encBreed = breed ? encryptText(breed) : null;
  const encBirth = birth_date ? encryptText(birth_date) : null;
  const encBreeder = breeder ? encryptText(breeder) : null;
  const encNotes = notes ? encryptText(notes) : null;

  // Hashes
  const pedigree_hash = generatePedigreeHash({
    cat_name,
    birth_date,
    sire_id,
    dam_id,
    unique_code
  });

  const previous_hash = null;
  const current_hash = generateCurrentHash({
    cat_name,
    breed,
    birth_date,
    gender,
    sire_id,
    dam_id,
    breeder,
    pedigree_number,
    notes,
    previous_hash
  });

  // FIX — urutan kolom & values SUDAH 100% BENAR
  const [res] = await pool.execute(
    `INSERT INTO cats 
     (unique_code, cat_name, species, breed, birth_date, gender,
      sire_id, dam_id, breeder, pedigree_number, notes,
      profile_image_url, profile_image_public_id,
      pedigree_hash, previous_hash, current_hash, user_id)
     VALUES (?, ?, 'Cat', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      unique_code,          // 1
      encName,              // 2
      encBreed,             // 3
      encBirth,             // 4
      gender,               // 5
      sire_id,              // 6
      dam_id,               // 7
      encBreeder,           // 8
      pedigree_number,      // 9
      encNotes,             // 10
      profile_image_url,    // 11
      profile_image_public_id, // 12
      pedigree_hash,        // 13
      previous_hash,        // 14
      current_hash,         // 15
      user_id               // 16
    ]
  );

  const newId = res.insertId;

  // History
  await pool.execute(
    `INSERT INTO cat_history (cat_id, action, changes, previous_hash, current_hash)
     VALUES (?, 'create', ?, ?, ?)`,
    [
      newId,
      JSON.stringify({
        cat_name,
        breed,
        birth_date,
        gender,
        sire_id,
        dam_id,
        breeder,
        pedigree_number,
        notes,
        user_id
      }),
      previous_hash,
      current_hash
    ]
  );

  return newId;
};

/* ============================================================
   UPDATE CAT
============================================================ */
export const updateCat = async (id, data) => {
  const [rows] = await pool.query(`SELECT * FROM cats WHERE id=?`, [id]);
  if (!rows.length) throw new Error("Cat not found");

  const current = rows[0];

  const currName = decryptText(current.cat_name);
  const currBreed = current.breed ? decryptText(current.breed) : null;
  const currBirth = current.birth_date ? decryptText(current.birth_date) : null;
  const currBreeder = current.breeder ? decryptText(current.breeder) : null;
  const currNotes = current.notes ? decryptText(current.notes) : null;

  const merged = {
    unique_code: data.unique_code ?? current.unique_code,
    cat_name: data.cat_name ?? currName,
    breed: data.breed ?? currBreed,
    birth_date: data.birth_date ?? currBirth,
    gender: data.gender ?? current.gender,
    sire_id: data.sire_id ?? current.sire_id,
    dam_id: data.dam_id ?? current.dam_id,
    breeder: data.breeder ?? currBreeder,
    pedigree_number: data.pedigree_number ?? current.pedigree_number,
    notes: data.notes ?? currNotes,
    user_id: data.user_id ?? current.user_id,
    profile_image_url: data.profile_image_url ?? current.profile_image_url,
    profile_image_public_id:
      data.profile_image_public_id ?? current.profile_image_public_id
  };

  const encName = encryptText(merged.cat_name);
  const encBreed = merged.breed ? encryptText(merged.breed) : null;
  const encBirth = merged.birth_date ? encryptText(merged.birth_date) : null;
  const encBreeder = merged.breeder ? encryptText(merged.breeder) : null;
  const encNotes = merged.notes ? encryptText(merged.notes) : null;

  const pedigree_hash = generatePedigreeHash({
    cat_name: merged.cat_name,
    birth_date: merged.birth_date,
    sire_id: merged.sire_id,
    dam_id: merged.dam_id,
    unique_code: merged.unique_code
  });

  const previous_hash =
    current.current_hash || (await getLastCurrentHash(id));
  const current_hash = generateCurrentHash({ ...merged, previous_hash });

  await pool.execute(
    `UPDATE cats SET 
      unique_code=?, cat_name=?, breed=?, birth_date=?, gender=?, 
      sire_id=?, dam_id=?, breeder=?, pedigree_number=?, notes=?,
      profile_image_url=?, profile_image_public_id=?,
      pedigree_hash=?, previous_hash=?, current_hash=?, user_id=?
     WHERE id=?`,
    [
      merged.unique_code,
      encName,
      encBreed,
      encBirth,
      merged.gender,
      merged.sire_id,
      merged.dam_id,
      encBreeder,
      merged.pedigree_number,
      encNotes,
      merged.profile_image_url,
      merged.profile_image_public_id,
      pedigree_hash,
      previous_hash,
      current_hash,
      merged.user_id,
      id
    ]
  );

  await pool.execute(
    `INSERT INTO cat_history (cat_id, action, changes, previous_hash, current_hash)
     VALUES (?, 'update', ?, ?, ?)`,
    [
      id,
      JSON.stringify({ before: current, after: merged }),
      previous_hash,
      current_hash
    ]
  );
};

/* ============================================================
   DELETE CAT
============================================================ */
export const deleteCat = async (id) => {
  await pool.execute(`DELETE FROM cats WHERE id=?`, [id]);
};

/* ============================================================
   GETTERS
============================================================ */
export const getAllCats = async () => {
  const [rows] = await pool.query(`SELECT * FROM cats ORDER BY id`);
  return rows.map((r) => ({
    ...r,
    cat_name: decryptText(r.cat_name),
    breed: r.breed ? decryptText(r.breed) : null,
    birth_date: r.birth_date ? decryptText(r.birth_date) : null,
    breeder: r.breeder ? decryptText(r.breeder) : null,
    notes: r.notes ? decryptText(r.notes) : null
  }));
};

export const getCatById = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM cats WHERE id=?`, [id]);
  if (!rows.length) return null;

  const r = rows[0];
  return {
    ...r,
    cat_name: decryptText(r.cat_name),
    breed: r.breed ? decryptText(r.breed) : null,
    birth_date: r.birth_date ? decryptText(r.birth_date) : null,
    breeder: r.breeder ? decryptText(r.breeder) : null,
    notes: r.notes ? decryptText(r.notes) : null
  };
};

/* ============================================================
   PEDIGREE SCAN
============================================================ */
export const insertPedigreeScan = async ({
  cat_id,
  scan_image,
  extracted_text = null,
  icr_status = "pending"
}) => {
  const [res] = await pool.execute(
    `INSERT INTO pedigree_scans (cat_id, scan_image, extracted_text, icr_status)
     VALUES (?, ?, ?, ?)`,
    [cat_id, scan_image, extracted_text, icr_status]
  );
  return res.insertId;
};

export const updatePedigreeScan = async (scanId, {
  extracted_text,
  icr_status
}) => {
  const [res] = await pool.execute(
    `UPDATE pedigree_scans
     SET extracted_text = ?, icr_status = ?
     WHERE id = ?`,
    [extracted_text, icr_status, scanId]
  );
  return res;
};
