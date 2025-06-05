import db from '../models/db.js';

export const getProfiles = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, created_at FROM profiles');
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      'SELECT id, name, created_at FROM profiles WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfileByAuthId = async (req, res) => {
  const { auth_id } = req.params;
  try {
    const { rows } = await db.query(
      'SELECT id, name, created_at FROM profiles WHERE auth_id = $1',
      [auth_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProfile = async (req, res) => {
  const { name, auth_id } = req.body;
  
  if (!name || !auth_id) {
    return res.status(400).json({ error: 'Name and auth_id are required' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO profiles (name, auth_id) VALUES ($1, $2) RETURNING id, name, created_at',
      [name, auth_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    // Check for unique constraint violation on auth_id
    if (err.code === '23505' && err.constraint === 'profiles_auth_id_key') {
      return res.status(409).json({ error: 'Profile already exists for this user' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};