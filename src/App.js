import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Restaurant from "./components/Restaurant";
import RestaurantDetails from "./components/RestaurantDetails";
import SignInPopup from "./components/SignInPopup";
import SignUpPopup from "./components/SignUpPopup";
import "./styles/App.css"


function Layout({ children }) {
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

      {children}
    </div>
  );
}

function HomePage({ restaurants, loading, error }) {
  return (
    <main className="container mx-auto px-4 pt-6">
      {loading ? (
        <div className="text-center">Loading restaurants...</div>
      ) : error ? (
        <div className="text-center text-red-600">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ paddingBottom: '1rem' }}>
          {restaurants.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              data={restaurant}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/restaurants');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage restaurants={restaurants} loading={loading} error={error} />} 
          />
          <Route 
            path="/restaurant/:id" 
            element={<RestaurantDetails restaurants={restaurants} />} 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
