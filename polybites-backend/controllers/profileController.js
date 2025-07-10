import db from '../models/db.js';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

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
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const { rows } = await db.query(
      'UPDATE profiles SET name = $1 WHERE auth_id = $2 RETURNING *',
      [name, auth_id]
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

export const deleteProfile = async (req, res) => {
  const { auth_id } = req.params;
  const { user_id } = req.body;

  console.log('Delete profile request:', { auth_id, user_id });

  // Verify that the user is trying to delete their own profile
  if (user_id !== auth_id) {
    console.log('User ID mismatch:', { user_id, auth_id });
    return res.status(403).json({ error: 'You can only delete your own profile' });
  }

  try {
    // First, delete all food reviews by this user
    const reviewsResult = await db.query(
      'DELETE FROM food_reviews WHERE user_id = $1',
      [auth_id]
    );
    console.log('Deleted reviews:', reviewsResult.rowCount);

    // Then delete the profile
    const { rows } = await db.query(
      'DELETE FROM profiles WHERE auth_id = $1 RETURNING *',
      [auth_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete the user from Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(auth_id);
    if (error) {
      console.error('Error deleting auth user:', error);
      return res.status(500).json({ error: 'Failed to delete user from auth system' });
    }

    console.log('Profile and auth user deleted successfully');
    res.json({ message: 'Profile and auth user deleted successfully' });
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};