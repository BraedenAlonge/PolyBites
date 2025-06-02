const db = require('../models/db');

const getFoodReviews = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM food_reviews');
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getFoodReviews }; 