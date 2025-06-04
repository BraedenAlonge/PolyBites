import db from '../models/db.js';

export const getFoods = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM foods ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM foods WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFoodsByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM foods WHERE restaurant_id = $1', [restaurantId]);
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};