import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';
import SignInPopup from './SignInPopup';
import SignUpPopup from './SignUpPopup';

export default function FoodDetails({ isOpen, onClose, foodItem }) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  const [reviewStats, setReviewStats] = useState({ review_count: 0, average_rating: 0 });

  const handleCloseSignIn = () => {
    setShowSignIn(false);
  };

  const handleCloseSignUp = () => {
    setShowSignUp(false);
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const handleWriteReviewClick = () => {
    if (user) {
      setIsWritingReview(true);
    } else {
      setShowSignUp(true);
    }
  };

  function formatName(fullName) {
  if (!fullName) return '';
  const [firstName, lastName] = fullName.trim().split(' ');
  return lastName ? `${firstName} ${lastName[0]}.` : firstName;
  }

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
        const [reviewsResponse, statsResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}`),
          fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}/stats`)
        ]);

        if (!reviewsResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch reviews or stats');
        }

        const [reviewsData, statsData] = await Promise.all([
          reviewsResponse.json(),
          statsResponse.json()
        ]);

        setReviews(reviewsData);
        setReviewStats(statsData);
        
        // Fetch user names for each review
        const uniqueUserIds = [...new Set(reviewsData.map(review => review.user_id))];
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

      // Fetch updated reviews and stats
      const [updatedReviewsResponse, updatedStatsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}`),
        fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}/stats`)
      ]);

      if (updatedReviewsResponse.ok && updatedStatsResponse.ok) {
        const [updatedReviews, updatedStats] = await Promise.all([
          updatedReviewsResponse.json(),
          updatedStatsResponse.json()
        ]);
        
        setReviews(updatedReviews);
        setReviewStats(updatedStats);
        
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

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      console.log('Attempting to delete review:', reviewId, 'for user:', user.id);
      
      const response = await fetch(`http://localhost:5000/api/food-reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
        credentials: 'include'
      });

      const responseData = await response.json();
      console.log('Delete response:', response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete review');
      }

      // Fetch updated reviews and stats
      const [updatedReviewsResponse, updatedStatsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}`),
        fetch(`http://localhost:5000/api/food-reviews/food/${foodItem.id}/stats`)
      ]);

      if (updatedReviewsResponse.ok && updatedStatsResponse.ok) {
        const [updatedReviews, updatedStats] = await Promise.all([
          updatedReviewsResponse.json(),
          updatedStatsResponse.json()
        ]);
        
        setReviews(updatedReviews);
        setReviewStats(updatedStats);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error.message || 'Failed to delete review. Please try again.');
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
                onClick={handleWriteReviewClick}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Add SignIn/SignUp Popups */}
          <SignInPopup 
            isOpen={showSignIn} 
            onClose={handleCloseSignIn}
            onSwitchToSignUp={handleSwitchToSignUp}
          />
          
          <SignUpPopup
            isOpen={showSignUp}
            onClose={handleCloseSignUp}
            onSwitchToSignIn={handleSwitchToSignIn}
          />

          {isWritingReview ? (
            <ReviewForm
              foodItem={foodItem}
              onSubmit={handleSubmitReview}
              onCancel={() => setIsWritingReview(false)}
            />
          ) : (
            <>
              <p className="text-gray-600 mb-4">{foodItem.description}</p>

              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="text-yellow-400 text-2xl">
                      {'⭐'.repeat(Math.round(reviewStats?.average_rating || 0))}
                    </div>
                    <span className="ml-2 text-lg font-medium">
                      {Number(reviewStats?.average_rating || 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {reviewStats?.review_count || 0} {(reviewStats?.review_count || 0) === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </div>

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
                            {formatName(userNames[review.user_id]) || 'User # ' + review.user_id}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">{'⭐'.repeat(review.rating)}</span>
                            {user && user.id === review.user_id && (
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete review"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
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