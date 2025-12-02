import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
dotenv.config();

// AUTH
import authRoutes from './Routes/authRoutes.js';
import * as AuthController from './Models/authModel.js';
import * as AuditModel from './Models/auditModel.js';

// ICR PEDIGREE (animal only, NO SCAN)
import animalRoutes from './Routes/catRoutes.js';
import * as AnimalModel from './Models/catModel.js';
import * as AnimalController from './Controller/catController.js';


import pedigreeConnectRoute from "./Routes/pedigreeConnectRoute.js";
import { initPedigreeConnectTables } from "./Models/catConnectModel.js";

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Logger setup
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

const accessLogStream = fs.createWriteStream(
  path.join('./logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// INIT DB TABLES
await AuthController.createUsersTableIfNotExists();
await AuditModel.createAuditTableIfNotExists();

// Pastikan user_profiles ada dulu
await initPedigreeConnectTables();

// Sekarang buat tabel cats (FK user_id sudah aman)
await AnimalModel.createCatsTableIfNotExists();
await AnimalModel.createCatHistoryTableIfNotExists();
await AnimalModel.createPedigreeScanTableIfNotExists();

if (AnimalController.init) await AnimalController.init();



await initPedigreeConnectTables();

// Seed admin
import { pool } from './Config/db.js';
const [users] = await pool.query('SELECT COUNT(*) as cnt FROM users');
if (users[0].cnt === 0) {
  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.default.hash('admin123', 10);
  await pool.execute(
    'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
    ['admin', hash, 'admin']
  );
  console.log('✅ Seeded admin: admin / admin123');
}

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/pedigree", pedigreeConnectRoute);

// Animal routes only — no scan
app.use('/api/animal', animalRoutes);

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running @ http://localhost:${PORT}`)
);
