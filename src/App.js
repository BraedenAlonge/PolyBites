import React, { useState } from "react";
import Restaurant from "./components/Restaurant";
import SignInPopup from "./components/SignInPopup";
import SignUpPopup from "./components/SignUpPopup";
import "./styles/App.css"
import brunchImage from "./assets/images/Brunch.webp";
import hearthImage from "./assets/images/Hearth.jpg";
import noodlesImage from "./assets/images/Noodles.avif";
import balanceImage from "./assets/images/Balance.jpg";
import deliImage from "./assets/images/Deli.jpg";
import jambaImage from "./assets/images/Jamba.jpg";
const dummyRestaurants = [
  {
    id: 1,
    name: "Brunch",
    image: brunchImage,
    rating: 4.5,
    reviews: [
      { id: 1, text: "Amazing food and great service!" },
      { id: 2, text: "Loved the spicy noodles." },
      { id: 3, text: "The ambiance was lovely." },
    ],
  },
  {
    id: 2,
    name: "Hearth",
    image: hearthImage,
    rating: 4.2,
    reviews: [
      { id: 1, text: "Juiciest burger I've ever had!" },
      { id: 2, text: "Fries were crispy and delicious." },
      { id: 3, text: "Good selection of beers." },
    ],
  },
  {
    id: 4,
    name: "Noodles",
    image: noodlesImage,
    rating: 4.3,
    reviews: [
      { id: 1, text: "Authentic noodle dishes." },
      { id: 2, text: "So many options to choose from!" },
      { id: 3, text: "The broth was rich and flavorful." },
    ],
  },
  {
    id: 3,
    name: "Streats",
    image: "https://source.unsplash.com/400x300/?streetfood",
    rating: 4.0,
    reviews: [
      { id: 1, text: "Quick and tasty bites!" },
      { id: 2, text: "Great for a casual meal." },
    ],
  },
  {
    id: 5,
    name: "Balance",
    image: balanceImage,
    rating: 4.7,
    reviews: [
      { id: 1, text: "Fresh and healthy options." },
      { id: 2, text: "Loved the smoothie!" },
      { id: 3, text: "Guilt-free deliciousness." },
    ],
  },
  {
    id: 6,
    name: "Mingle",
    image: "https://source.unsplash.com/400x300/?cafe",
    rating: 3.9,
    reviews: [
      { id: 1, text: "Cozy atmosphere." },
      { id: 2, text: "Good coffee and pastries." },
    ],
  },
  {
    id: 7,
    name: "Nosh",
    image: "https://source.unsplash.com/400x300/?diner",
    rating: 4.1,
    reviews: [
      { id: 1, text: "Classic diner food done right." },
      { id: 2, text: "Great milkshakes!" },
    ],
  },
  {
    id: 8,
    name: "Vista Grande Express",
    image: "https://source.unsplash.com/400x300/?diner",
    rating: 4.1,
    reviews: [
      { id: 1, text: "Classic diner food done right." },
      { id: 2, text: "Great milkshakes!" },
    ],
  },
  {
    id: 9,
    name: "Grand Avenue Deli",
    image: deliImage,
    rating: 4.1,
    reviews: [
      { id: 1, text: "Classic diner food done right." },
      { id: 2, text: "Great milkshakes!" },
    ],
  },
  {
    id: 10,
    name: "Jamba Juice",
    image: jambaImage,
    rating: 4.1,
    reviews: [
      { id: 1, text: "Classic diner food done right." },
      { id: 2, text: "Great milkshakes!" },
    ],
  },
];

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleSwitchToSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };

  const handleSwitchToSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-600 text-white shadow-lg py-2 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Poly Bites 🍽️</h1>
          <button 
            onClick={() => setIsSignInOpen(true)}
            className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      <SignInPopup 
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />

      <SignUpPopup 
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToSignIn={handleSwitchToSignIn}
      />

      <main className="container mx-auto px-4 pt-6">
        {!selectedRestaurant ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ paddingBottom: '1rem' }}>
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
