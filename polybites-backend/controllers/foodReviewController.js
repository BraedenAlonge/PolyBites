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

const createFoodReview = async (req, res) => {
  const { user_id, food_id, rating, text } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO food_reviews (user_id, food_id, rating, text) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, food_id, rating, text]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getFoodReviews, createFoodReview }; 