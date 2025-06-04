import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

async function testDB() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('DB connected successfully:', res.rows);
  } catch (err) {
    console.error('DB Connection Error:', err);
  }
}

testDB();