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
      { id: 1, text: "Juiciest burger I’ve ever had!" },
      { id: 2, text: "Fries were crispy and delicious." },
    ],
  },
];

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Poly Bites 🍽️</h1>
      {!selectedRestaurant ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => setSelectedRestaurant(null)}
          >
            ← Back to list
          </button>
          <div className="bg-white shadow-lg rounded p-4">
            <img
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              className="w-full h-60 object-cover rounded"
            />
            <h2 className="text-2xl font-semibold mt-4">
              {selectedRestaurant.name}
            </h2>
            <p className="text-yellow-600 font-medium">
              Rating: {selectedRestaurant.rating} ⭐
            </p>
            <h3 className="mt-4 text-lg font-semibold">Reviews</h3>
            <ul className="list-disc pl-6 mt-2">
              {selectedRestaurant.reviews.map((review) => (
                <li key={review.id} className="text-gray-700">
                  {review.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
