import React, { useState } from 'react';

export default function ReviewForm({ foodItem, onSubmit, onCancel }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      user_id: 1, // Temporary hardcoded user ID until auth is implemented
      food_id: foodItem.id,
      rating,
      text: reviewText
    });
    setRating(5);
    setReviewText('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl p-2 hover:scale-110 transition-transform ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              aria-label={`Rate ${star} stars`}
              title={`Rate ${star} stars`}
            >
              ⭐
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {rating === 1 && "Poor"}
          {rating === 2 && "Fair"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very Good"}
          {rating === 5 && "Excellent"}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Your Review
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="Share your thoughts about this dish..."
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
} 