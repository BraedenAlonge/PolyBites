import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Restaurant from "./components/Restaurant";
import RestaurantDetails from "./components/RestaurantDetails";

// Login
import SignInPopup from "./components/SignInPopup";
import SignUpPopup from "./components/SignUpPopup";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
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
      {/* Use Navbar */}
      <Navbar onSignInOpen={() => setIsSignInOpen(true)} />

      {/* Popups */}
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

      {/* Children */}
      {children}
    </div>
  );
}

function HomePage({ restaurants, loading, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState('');

  // Animation state for subtitle lines
  const [subtitleVisible, setSubtitleVisible] = useState([false, false, false]);

  useEffect(() => {
    setFilteredRestaurants(restaurants);
  }, [restaurants]);

  useEffect(() => {
    // Sequentially show each line
    const timers = [
      setTimeout(() => setSubtitleVisible(v => [true, false, false]), 600),
      setTimeout(() => setSubtitleVisible(v => [true, true, false]), 1300),
      setTimeout(() => setSubtitleVisible([true, true, true]), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setDisplayedSearchTerm(searchTerm);
    const filtered = restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRestaurants(filtered);
    setHasSearched(true);
  };

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-600 to-green-500 text-white py-16 mb-12 relative overflow-hidden" style={{ height: '70vh', minHeight: 500 }}>
        {/* Opaque food image background */}
        <img
          src={require('./assets/images/green-back.jpeg')}
          alt="Food background"
          className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none select-none"
          style={{ zIndex: 0, minHeight: 600 }}
        />
        {/* Overlay for better blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-700/80 to-green-500/80" style={{ zIndex: 1 }}></div>
        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col justify-center items-center h-full">
          <h1 className="text-8xl md:text-8xl font-extrabold mb-8 animate-fade-in">
            Poly Bites
          </h1>
          <p className="text-4xl md:text-4xl text-green-100 mb-12 font-semibold">
            <span className={`block transition-all duration-700 ${subtitleVisible[0] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>Your Ratings.</span>
            <span className={`block transition-all duration-700 ${subtitleVisible[1] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>Your Reviews.</span>
            <span className={`block transition-all duration-700 ${subtitleVisible[2] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>Your Restaurants.</span>
          </p>
          <div className="w-24 h-1 bg-white mx-auto rounded-full opacity-50"></div>
        </div>
        {/* Wave SVG divider */}
        <div className="absolute left-0 right-0 bottom-0 w-full overflow-hidden leading-none pointer-events-none" style={{zIndex: 2, lineHeight: 0}}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 490"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-40"
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <path
              d="M 0,500 L 0,400 C 53.00858811405017,423.5073857780831 106.01717622810034,447.01477155616627 181,445 C 255.98282377189966,442.98522844383373 352.9398832016489,415.4482995534181 427,396 C 501.0601167983511,376.5517004465819 552.2232909653039,365.19203023016146 602,374 C 651.7767090346961,382.80796976983854 700.166952937135,411.7835795259361 784,415 C 867.833047062865,418.2164204740639 987.108897286156,395.67365166609413 1059,381 C 1130.891102713844,366.32634833390587 1155.3974579182411,359.5218138096874 1211,364 C 1266.6025420817589,368.4781861903126 1353.3012710408793,384.2390930951563 1440,400 L 1440,500 L 0,500 Z"
              stroke="none"
              strokeWidth="0"
              fill="#f0fdf4"
              fillOpacity="1"
            />
          </svg>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="container mx-auto px-4 -mt-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">Loading restaurants...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 bg-red-50 p-4 rounded-lg inline-block">
              Error: {error}
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col space-y-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {hasSearched && displayedSearchTerm.trim() ? `Results for "${displayedSearchTerm}"` : 'All Restaurants'}
                </h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search restaurants..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {filteredRestaurants.map((restaurant) => (
                  <Restaurant
                    key={restaurant.id}
                    data={restaurant}
                  />
                ))}
                {filteredRestaurants.length === 0 && hasSearched && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No restaurants found matching "{displayedSearchTerm}"
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
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
        console.log('Fetching restaurants...');
        const response = await fetch('http://localhost:5000/api/restaurants');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        console.log('Fetched restaurants:', data);
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Add debug log for restaurants state
  console.log('Current restaurants state:', restaurants);

  return (
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={<HomePage 
                  restaurants={restaurants || []} 
                  loading={loading} 
                  error={error} 
                />}
              />
              <Route
                path="/restaurant/:id"
                element={<RestaurantDetails restaurants={restaurants || []} />}
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
  );
}
