import db from '../models/db.js';

export const getRestaurants = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        r.*,
        COALESCE(AVG(fr.rating), 0) as average_rating,
        COUNT(DISTINCT fr.id) as review_count,
        COUNT(DISTINCT f.id) as menu_item_count
      FROM restaurants r
      LEFT JOIN foods f ON f.restaurant_id = r.id
      LEFT JOIN food_reviews fr ON fr.food_id = f.id
      GROUP BY r.id
      ORDER BY r.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};