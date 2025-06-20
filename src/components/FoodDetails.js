import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';
import SignInPopup from './SignInPopup';
import SignUpPopup from './SignUpPopup';
import fullStar from '../assets/stars/star.png';
import halfStar from '../assets/stars/half_star.png';
import emptyStar from '../assets/stars/empty_star.png';

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

        if (!reviewsResponse.ok) {
          const errorData = await reviewsResponse.json();
          throw new Error(errorData.error || 'Failed to fetch reviews');
        }
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json();
          throw new Error(errorData.error || 'Failed to fetch stats');
        }

        const [reviewsData, statsData] = await Promise.all([
          reviewsResponse.json(),
          statsResponse.json()
        ]);

        // Get like status for each review if user is logged in
        if (user) {
          const reviewsWithLikes = await Promise.all(
            reviewsData.map(async (review) => {
              try {
                const likeResponse = await fetch(
                  `http://localhost:5000/api/food-reviews/${review.id}/like/${user.id}`
                );
                if (likeResponse.ok) {
                  const { exists } = await likeResponse.json();
                  return { ...review, liked: exists };
                }
                return review;
              } catch (err) {
                console.error('Error fetching like status:', err);
                return review;
              }
            })
          );
          setReviews(reviewsWithLikes);
        } else {
          setReviews(reviewsData);
        }

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
  }, [isOpen, foodItem?.id, user]);

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

    // Helper to get food icon path (same as RestaurantDetails)
  const getFoodIcon = (food_type) => {
    try {
      if (food_type) {
        return require(`../assets/Icons/${food_type.toLowerCase()}.png`);
      }
    } catch (e) {}
    return require('../assets/Icons/food_default.png');
  };

  // Render stars with half-star support for review ratings
  const renderStars = (rating) => {
    const stars = [];
    let remaining = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (remaining >= 1) {
        stars.push(<img key={i + '-full'} src={fullStar} alt="Full star" className="w-5 h-5 inline" />);
        remaining -= 1;
      } else if (remaining === 0.5) {
        stars.push(<img key={i + '-half'} src={halfStar} alt="Half star" className="w-5 h-5 inline" />);
        remaining -= 0.5;
      } else {
        stars.push(<img key={i + '-empty'} src={emptyStar} alt="Empty star" className="w-5 h-5 inline" />);
      }
    }
    return stars;
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

  const handleLikeReview = async (reviewId) => {
    if (!user) {
      setShowSignIn(true);
      return;
    }

    try {
      console.log('Checking like status for review:', reviewId, 'user:', user.id);
      
      // First check if the user has already liked this review
      const checkResponse = await fetch(`http://localhost:5000/api/food-reviews/${reviewId}/like/${user.id}`);
      if (!checkResponse.ok) {
        throw new Error('Failed to check like status');
      }
      const { exists } = await checkResponse.json();

      let response;
      if (exists) {
        // Remove like
        response = await fetch(`http://localhost:5000/api/food-reviews/${reviewId}/like`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            review_id: reviewId,
            user_id: user.id 
          }),
          credentials: 'include'
        });
      } else {
        // Add like
        response = await fetch(`http://localhost:5000/api/food-reviews/${reviewId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            review_id: reviewId,
            user_id: user.id 
          }),
          credentials: 'include'
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update like');
      }

      const data = await response.json();
      console.log('Like update response:', data);
      
      // Update the review's likes count and liked state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, likes: data.likes, liked: !exists }
            : review
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
      alert(error.message || 'Failed to update like. Please try again.');
    }

  };


  // Returns a color from red (0) to green (5) for the rating
  const getRatingColor = (rating) => {
    // Clamp rating between 0 and 5
    const clamped = Math.max(0, Math.min(5, rating));
    // Interpolate hue from 0 (red) to 120 (green)
    const hue = (clamped / 5) * 120;
    return `hsl(${hue}, 70%, 40%)`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="food-review-popup bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="relative flex flex-col items-center justify-center">
          <div className="flex flex-row justify-center items-center gap-4 my-4">
            <img
              src={getFoodIcon(foodItem.food_type)}
              alt={foodItem.name}
              className="w-24 h-24 object-contain"
            />
            <img
              src={getFoodIcon(foodItem.food_type)}
              alt={foodItem.name}
              className="w-24 h-24 object-contain"
            />
            <img
              src={getFoodIcon(foodItem.food_type)}
              alt={foodItem.name}
              className="w-24 h-24 object-contain"
            />
          </div>
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
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Reviews</h4>
                {/* Average rating display */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="font-bold text-lg"
                    style={{ color: getRatingColor(reviewStats.average_rating) }}
                  >
                    {reviewStats.average_rating ? Number(reviewStats.average_rating).toFixed(1) : '0.0'}
                  </span>
                  <span className="flex items-center">{renderStars(reviewStats.average_rating)}</span>
                  <span className="text-gray-500 text-sm">({reviewStats.review_count || 0} reviews)</span>
                </div>
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
                           <span className="text-green-600 flex items-center">{renderStars(review.rating)}</span>
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
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleLikeReview(review.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                            title={review.liked ? "Unlike review" : "Like review"}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              viewBox="0 0 20 20" 
                              fill={review.liked ? "currentColor" : "none"}
                              stroke="currentColor"
                            >
                              <path 
                                fillRule="evenodd" 
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                            <span className="text-sm">{review.likes || 0}</span>
                          </button>
                        </div>
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