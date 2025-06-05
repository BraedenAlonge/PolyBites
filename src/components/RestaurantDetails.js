import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodReview from './FoodDetails';

export default function RestaurantDetails({ restaurants }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFood, setSelectedFood] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const pageRef = useRef(null);
  
  const restaurant = restaurants?.find(r => r.id === parseInt(id));

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/foods/restaurant/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchRestaurantRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/food-reviews/food-review-details`);
        if (!response.ok) {
          throw new Error('Failed to fetch ratings');
        }
        const data = await response.json();
        const restaurantRating = data.find(r => r.restaurant_id === parseInt(id));
        setAverageRating(restaurantRating?.average_rating || 0);
      } catch (err) {
        console.error('Error fetching restaurant rating:', err);
        setAverageRating(0);
      }
    };

    if (id) {
      fetchMenuItems();
      fetchRestaurantRating();
    }
  }, [id]);

  useEffect(() => {
    function handleClickOutside(event) {
      // Close the food review if clicking outside of it and it's not a menu item click
      if (selectedFood && 
          !event.target.closest('.food-review-popup') && 
          !event.target.closest('.menu-item')) {
        setSelectedFood(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedFood]);

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    return '⭐'.repeat(roundedRating);
  };

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Restaurant not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="relative min-h-screen">
      {/* Fixed back button */}
      <div className="fixed top-24 left-4 md:left-8 z-[60]">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
        >
          <span>←</span> Back to list
        </button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-72 object-cover"
          />
          <div className="p-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold text-gray-800">
                {restaurant.name}
              </h2>
            </div>
            <div className="text-green-600 font-medium text-lg mb-6 flex items-center gap-2">
              <span>Rating: {Number(averageRating).toFixed(1)}</span>
              <span className="text-2xl">{renderStars(averageRating)}</span>
              {restaurant.Location && (
                <span className="text-gray-500 text-2xl ml-4">{restaurant.Location}</span>

              )}
            </div>

            {loading ? (
              <div className="text-center py-8">Loading menu items...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">Error: {error}</div>
            ) : menuItems.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Menu Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedFood(item)}
                      className="menu-item group cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-green-50 transition-colors"
                    >
                      <div className="relative h-48 mb-3 overflow-hidden rounded">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-lg font-medium">${item.price}</p>
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No menu items available</p>
            )}
          </div>
        </div>

        <FoodReview
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          foodItem={selectedFood}
        />
      </div>
    </div>
  );
} 