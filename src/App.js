import React, { useState } from "react";
import Restaurant from "./components/Restaurant";
import "./styles/App.css"

const dummyRestaurants = [
  {
    id: 1,
    name: "Brunch",
    image: "https://source.unsplash.com/400x300/?restaurant,asian",
    rating: 4.5,
    reviews: [
      { id: 1, text: "Amazing food and great service!" },
      { id: 2, text: "Loved the spicy noodles." },
    ],
  },
  {
    id: 2,
    name: "Hearth",
    image: "https://source.unsplash.com/400x300/?burger,food",
    rating: 4.2,
    reviews: [
      { id: 1, text: "Juiciest burger I've ever had!" },
      { id: 2, text: "Fries were crispy and delicious." },
    ],
  },
];

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-600 text-white shadow-lg p-4 mb-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Poly Bites 🍽️</h1>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {!selectedRestaurant ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyRestaurants.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                data={restaurant}
                onClick={() => setSelectedRestaurant(restaurant)}
              />
            ))}
          </div>
        ) : (
          <div>
            <button
              className="mb-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center gap-2"
              onClick={() => setSelectedRestaurant(null)}
            >
              <span>←</span> Back to list
            </button>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-72 object-cover"
              />
              <div className="p-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                  {selectedRestaurant.name}
                </h2>
                <p className="text-green-600 font-medium text-lg mb-4">
                  Rating: {selectedRestaurant.rating} ⭐
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Reviews</h3>
                  <ul className="space-y-3">
                    {selectedRestaurant.reviews.map((review) => (
                      <li key={review.id} className="bg-white p-3 rounded-lg shadow-sm">
                        {review.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
