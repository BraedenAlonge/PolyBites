import React from 'react';

export default function FoodReview({ isOpen, onClose, foodItem }) {
  if (!isOpen || !foodItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="food-review-popup bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="relative">
          <img
            src={foodItem.image}
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
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{foodItem.name}</h3>
              <p className="text-green-600 text-lg font-medium">${foodItem.price}</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{foodItem.description}</p>

          {foodItem.details && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">Details</h4>
              <ul className="list-disc list-inside text-gray-600">
                {foodItem.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {foodItem.reviews && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Reviews</h4>
              <div className="space-y-3">
                {foodItem.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{review.author}</span>
                      <span className="text-green-600">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 