import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';

export default function FoodDetails({ isOpen, onClose, foodItem }) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({});

  const fetchUserName = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/auth/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const userData = await response.json();
      setUserNames(prev => ({
        ...prev,
        [userId]: userData.name
      }));
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUserNames(prev => ({
        ...prev,
        [userId]: 'User #' + userId
      }));
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (!foodItem?.id) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
        
        // Fetch user names for each review
        const uniqueUserIds = [...new Set(data.map(review => review.user_id))];
        uniqueUserIds.forEach(userId => {
          fetchUserName(userId);
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, foodItem?.id]);

  if (!isOpen || !foodItem) return null;

  const handleSubmitReview = async (reviewData) => {
    try {
      const response = await fetch('http://localhost:5000/api/food-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Fetch updated reviews instead of reloading
      const updatedResponse = await fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}`);
      if (updatedResponse.ok) {
        const updatedReviews = await updatedResponse.json();
        setReviews(updatedReviews);
        
        // Fetch user name for the new review if needed
        const newUserId = reviewData.user_id;
        if (!userNames[newUserId]) {
          fetchUserName(newUserId);
        }
      }

      setIsWritingReview(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="food-review-popup bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="relative">
          <img
            src={foodItem.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={foodItem.name}
            className="w-full h-48 md:h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-800 text-xl">×</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{foodItem.name}</h3>
              <p className="text-green-600 text-lg font-medium">${foodItem.price}</p>
            </div>
            {!isWritingReview && (
              <button
                onClick={() => setIsWritingReview(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {isWritingReview ? (
            <ReviewForm
              foodItem={foodItem}
              onSubmit={handleSubmitReview}
              onCancel={() => setIsWritingReview(false)}
            />
          ) : (
            <>
              <p className="text-gray-600 mb-4">{foodItem.description}</p>

              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Reviews</h4>
                {loading ? (
                  <div className="text-center py-4">Loading reviews...</div>
                ) : error ? (
                  <div className="text-center text-red-600 py-4">Error loading reviews: {error}</div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">
                            {userNames[review.user_id] || 'User # ' + review.user_id}
                          </span>
                          <span className="text-green-600">{'⭐'.repeat(review.rating)}</span>
                        </div>
                        <p className="text-gray-600">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 