import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Restaurant.css';

//function to fetch foods from a restaurnat and count the number of items
const fetchNumberOfFoods = async (restaurantId) => {
  const response = await fetch(`http://localhost:5000/api/foods/restaurant/${restaurantId}`);
  const data = await response.json();
  return data.length;
};

const fetchFoodReviewDetails = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/food-reviews/food-review-details');
    if (!response.ok) {
      throw new Error('Failed to fetch review details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching review details:', error);
    return [];
  }
};

export default function Restaurant({ data }) {
  console.log('Restaurant component received data:', data);

  const [menuItemCount, setMenuItemCount] = useState(0);
  const [reviewDetails, setReviewDetails] = useState({
    review_count: 0,
    average_rating: 0
  });

  useEffect(() => {
    const getMenuItemCount = async () => {
      if (!data?.id || data?.menuItems) return;
      try {
        const count = await fetchNumberOfFoods(data.id);
        setMenuItemCount(count);
      } catch (error) {
        console.error('Error fetching menu items count:', error);
        setMenuItemCount(0);
      }
    };

    getMenuItemCount();
  }, [data?.id, data?.menuItems]);

  useEffect(() => {
    const getReviewDetails = async () => {
      if (!data?.id) return;
      
      try {
        const allDetails = await fetchFoodReviewDetails();
        const restaurantDetails = allDetails.find(detail => detail.restaurant_id === data?.id) || {
          review_count: 0,
          average_rating: 0
        };
        setReviewDetails(restaurantDetails);
      } catch (error) {
        console.error('Error fetching review details:', error);
        setReviewDetails({
          review_count: 0,
          average_rating: 0
        });
      }
    };

    getReviewDetails();
  }, [data?.id]);

  // Format the average rating to one decimal place
  const formattedRating = Number(reviewDetails?.average_rating || 0).toFixed(1);

  // Return early with loading state if data is not yet available
  if (!data) {
    console.log('No data provided to Restaurant component');
    return (
      <div className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4">
        <p className="text-gray-500">Loading restaurant data...</p>
      </div>
    );
  }

  // Return early if no ID is available
  if (!data.id) {
    console.log('No restaurant ID provided');
    return (
      <div className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4">
        <p className="text-gray-500">Invalid restaurant data</p>
      </div>
    );
  }

  return (
    <Link
      to={`/restaurant/${data.id}`}
      className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={data.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={data.name || 'Restaurant'}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 m-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {formattedRating} ⭐
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{data.name || 'Unnamed Restaurant'}</h2>
        <div className="space-y-1">
          {!data.menuItems && (
            <p className="text-gray-500 text-sm"><strong>{menuItemCount}</strong> menu items</p>
          )}
          <p className="text-gray-500 text-sm"><strong>{reviewDetails.review_count}</strong> reviews</p>
        </div>
      </div>
    </Link>
  );
}
