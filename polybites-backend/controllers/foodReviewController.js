import db from '../models/db.js';

export const getFoodReviews = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM food_reviews');
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFoodReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM food_reviews WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Food review not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFoodReviewsByFoodId = async (req, res) => {
  const { foodId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM food_reviews WHERE food_id = $1 ORDER BY id ASC', [foodId]);
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFoodReviewsByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const { rows } = await db.query(
      `SELECT fr.*, f.name as food_name 
       FROM food_reviews fr 
       JOIN foods f ON fr.food_id = f.id 
       WHERE f.restaurant_id = $1 
       ORDER BY fr.id ASC`,
      [restaurantId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFoodReviewDetails = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
        r.id as restaurant_id,
        r.name as restaurant_name,
        COUNT(fr.id) as review_count,
        COALESCE(AVG(fr.rating), 0) as average_rating
       FROM restaurants r
       LEFT JOIN foods f ON f.restaurant_id = r.id
       LEFT JOIN food_reviews fr ON fr.food_id = f.id
       GROUP BY r.id, r.name
       ORDER BY review_count DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createFoodReview = async (req, res) => {
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

export const getFoodReviewStats = async (req, res) => {
  const { foodId } = req.params;
  try {
    const { rows } = await db.query(
      `SELECT 
        COUNT(id) as review_count,
        COALESCE(AVG(rating), 0) as average_rating
       FROM food_reviews
       WHERE food_id = $1
       GROUP BY food_id`,
      [foodId]
    );
    res.json(rows[0] || { review_count: 0, average_rating: 0 });
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteFoodReview = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  console.log('Delete request received:', { id, user_id });

  if (!user_id) {
    console.error('No user_id provided in request body');
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // First check if the review exists and belongs to the user
    const { rows } = await db.query(
      'SELECT * FROM food_reviews WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    console.log('Review check result:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Food review not found or unauthorized' });
    }

    // Delete all likes associated with this review first
    await db.query('DELETE FROM likes WHERE food_review_id = $1', [id]);

    // Then delete the review
    const deleteResult = await db.query('DELETE FROM food_reviews WHERE id = $1 RETURNING *', [id]);
    console.log('Delete result:', deleteResult.rows);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLike = async (req, res) => {
  const { reviewId, userId } = req.params;
  console.log('Checking like for review:', reviewId, 'user:', userId);

  if (!reviewId || !userId) {
    console.error('Missing required parameters:', { reviewId, userId });
    return res.status(400).json({ error: 'Review ID and User ID are required' });
  }

  try {
    const { rows } = await db.query(
      'SELECT * FROM likes WHERE food_review_id = $1 AND user_id = $2',
      [reviewId, userId]
    );
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addLike = async (req, res) => {
  const { review_id, user_id } = req.body;

  try {
    // Add like to likes table
    await db.query(
      'INSERT INTO likes (user_id, food_review_id) VALUES ($1, $2)',
      [user_id, review_id]
    );

    // Increment likes count in food_reviews table
    const { rows: [updatedReview] } = await db.query(
      'UPDATE food_reviews SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [review_id]
    );

    res.json({ likes: updatedReview.likes });
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeLike = async (req, res) => {
  const { review_id, user_id } = req.body;

  try {
    // Remove like from likes table
    await db.query(
      'DELETE FROM likes WHERE user_id = $1 AND food_review_id = $2',
      [user_id, review_id]
    );

    // Decrement likes count in food_reviews table
    const { rows: [updatedReview] } = await db.query(
      'UPDATE food_reviews SET likes = GREATEST(likes - 1, 0) WHERE id = $1 RETURNING likes',
      [review_id]
    );

    res.json({ likes: updatedReview.likes });
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReviewLikes = async (req, res) => {
  const { reviewId } = req.params;
  const { user_id } = req.query;

  try {
    // Get like count
    const { rows: [likeCount] } = await db.query(
      'SELECT COUNT(*) as count FROM likes WHERE food_review_id = $1',
      [reviewId]
    );

    // Check if the current user has liked this review
    let userLiked = false;
    if (user_id) {
      const { rows: userLike } = await db.query(
        'SELECT * FROM likes WHERE food_review_id = $1 AND user_id = $2',
        [reviewId, user_id]
      );
      userLiked = userLike.length > 0;
    }

    res.json({
      likes: parseInt(likeCount.count),
      userLiked
    });
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReviewsWithLikes = async (req, res) => {
  const { foodId } = req.params;
  const { user_id } = req.query;

  try {
    // Get all reviews for the food item
    const { rows: reviews } = await db.query(
      'SELECT * FROM food_reviews WHERE food_id = $1 ORDER BY id ASC',
      [foodId]
    );

    // Get like counts and user's likes for all reviews
    const reviewsWithLikes = await Promise.all(reviews.map(async (review) => {
      const { rows: [likeCount] } = await db.query(
        'SELECT COUNT(*) as count FROM likes WHERE food_review_id = $1',
        [review.id]
      );

      let userLiked = false;
      if (user_id) {
        const { rows: userLike } = await db.query(
          'SELECT * FROM likes WHERE food_review_id = $1 AND user_id = $2',
          [review.id, user_id]
        );
        userLiked = userLike.length > 0;
      }

      return {
        ...review,
        likes: parseInt(likeCount.count),
        liked: userLiked
      };
    }));

    res.json(reviewsWithLikes);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 