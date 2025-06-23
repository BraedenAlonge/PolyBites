import db from '../models/db.js';

export const getProfiles = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, created_at, anonymous_posting FROM profiles');
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
      'SELECT id, name, created_at, anonymous_posting FROM profiles WHERE id = $1',
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
      'SELECT id, name, created_at, anonymous_posting FROM profiles WHERE auth_id = $1',
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
  const { name, auth_id, anonymous_posting = false } = req.body;
  
  if (!name || !auth_id) {
    return res.status(400).json({ error: 'Name and auth_id are required' });
  }

  try {
    // First, verify that the auth_id exists in the auth.users table
    const { rows: authCheck } = await db.query(
      'SELECT id FROM auth.users WHERE id = $1',
      [auth_id]
    );
    
    if (authCheck.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid auth_id: User does not exist in auth system',
        auth_id: auth_id 
      });
    }

    const { rows } = await db.query(
      'INSERT INTO profiles (name, auth_id, anonymous_posting) VALUES ($1, $2, $3) RETURNING id, name, created_at, anonymous_posting',
      [name, auth_id, anonymous_posting]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    // Check for unique constraint violation on auth_id
    if (err.code === '23505' && err.constraint === 'profiles_auth_id_key') {
      return res.status(409).json({ error: 'Profile already exists for this user' });
    }
    // Check for foreign key constraint violation
    if (err.code === '23503' && err.constraint === 'profiles_auth_id_fkey') {
      return res.status(400).json({ 
        error: 'Invalid auth_id: User does not exist in auth system',
        auth_id: auth_id 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  const { auth_id } = req.params;
  const { name, anonymous_posting } = req.body;
  
  console.log('updateProfile called with:', { auth_id, name, anonymous_posting });
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    console.log('Executing SQL update with:', [name, anonymous_posting, auth_id]);
    
    const { rows } = await db.query(
      'UPDATE profiles SET name = $1, anonymous_posting = $2 WHERE auth_id = $3 RETURNING id, name, created_at, anonymous_posting',
      [name, anonymous_posting, auth_id]
    );
    
    console.log('SQL update result:', rows);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};