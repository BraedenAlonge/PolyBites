import React, { useState, useEffect, useMemo, useCallback } from "react";
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
      <Navbar onSignInOpen={() => setIsSignInOpen(true)} 
              onSignUpOpen={() => setIsSignUpOpen(true)}/>

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
  const [sortBy, setSortBy] = useState('default');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Animation state for subtitle lines
  const [subtitleVisible, setSubtitleVisible] = useState([false, false, false]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // 150ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize the sorting function
  const sortRestaurants = useCallback((restaurants, sortType) => {
    if (!restaurants.length) return [];
    
    let sorted = [...restaurants];
    
    switch (sortType) {
      case 'rating':
        sorted.sort((a, b) => {
          const aRating = parseFloat(a.average_rating) || 0;
          const bRating = parseFloat(b.average_rating) || 0;
          return bRating - aRating;
        });
        break;
      case 'reviews':
        sorted.sort((a, b) => {
          const aReviews = parseInt(a.review_count) || 0;
          const bReviews = parseInt(b.review_count) || 0;
          return bReviews - aReviews;
        });
        break;
      case 'menu_items':
        sorted.sort((a, b) => {
          const aItems = parseInt(a.menu_item_count) || 0;
          const bItems = parseInt(b.menu_item_count) || 0;
          return bItems - aItems;
        });
        break;
      case 'location':
        sorted.sort((a, b) => {
          const aLocation = (a.Location || '').toLowerCase();
          const bLocation = (b.Location || '').toLowerCase();
          return aLocation.localeCompare(bLocation);
        });
        break;
      default:
        sorted.sort((a, b) => a.id - b.id);
    }
    
    return sorted;
  }, []);

  // Memoize filtered and sorted restaurants
  const processedRestaurants = useMemo(() => {
    // First filter
    const filtered = debouncedSearchTerm.trim() === ''
      ? restaurants
      : restaurants.filter(restaurant =>
          restaurant.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    
    // Then sort
    return sortRestaurants(filtered, sortBy);
  }, [debouncedSearchTerm, sortBy, restaurants, sortRestaurants]);

  // Update filtered restaurants when processed results change
  useEffect(() => {
    setFilteredRestaurants(processedRestaurants);
    if (debouncedSearchTerm.trim() !== '') {
      setHasSearched(true);
      setDisplayedSearchTerm(debouncedSearchTerm);
    }
  }, [processedRestaurants, debouncedSearchTerm]);

  useEffect(() => {
    // Sequentially show each line
    const timers = [
      setTimeout(() => setSubtitleVisible(v => [true, false, false]), 800),
      setTimeout(() => setSubtitleVisible(v => [true, true, false]), 1600),
      setTimeout(() => setSubtitleVisible([true, true, true]), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm.trim() === '') {
      setHasSearched(false);
      setDisplayedSearchTerm('');
    }
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDisplayedSearchTerm('');
    setHasSearched(false);
    setDebouncedSearchTerm('');
  };

  const clearSort = () => {
    setSortBy('default');
  };

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-600 to-green-500 text-white py-16 mb-12 relative overflow-hidden" style={{ height: '70vh', minHeight: 500 }}>
        {/* Opaque food image background */}
        <img
          src={require('./assets/images/food-back.jpg')}
          alt="Food background"
          className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none select-none"
          style={{ zIndex: 0, minHeight: 600 }}
        />
        {/* Overlay for better blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-700/80 to-green-500/80" style={{ zIndex: 1, paddingTop: 0 }}></div>
        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col justify-center items-center h-full" >
          <h1 className="text-8xl text-black md:text-8xl font-extrabold mb-8 animate-fade-in">
            PolyBites
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
            style={{ display: 'block', width: '108%', height: '100%' }}
          >
            <path
              d="M -100,500 L -100,400 C -47,423.5 6,447 81,445 C 156,443 253,415.4 327,396 C 401,376.5 452,365.2 502,374 C 552,382.8 600,411.8 684,415 C 768,418.2 887,395.7 959,381 C 1031,366.3 1055,359.5 1111,364 C 1167,368.5 1253,384.2 1340,400 L 1440,400 L 1440,500 L -100,500 Z"
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
            <div className="max-w-[1600px] mx-auto px-6">
              <div className="flex flex-col space-y-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {hasSearched && displayedSearchTerm.trim() ? `Results for "${displayedSearchTerm}"` : 'All Restaurants'}
                </h2>
                
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search restaurants..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="relative w-48">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                      className={`w-full cursor-pointer px-4 py-2 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none ${sortBy === 'default' ? 'text-gray-400' : 'text-gray-900'}`}
                    >
                      <option value="default" hidden>Sort by</option>
                      <option value="rating" className="text-gray-900">Rating</option>
                      <option value="reviews" className="text-gray-900">Reviews</option>
                      <option value="menu_items" className="text-gray-900">Menu Items</option>
                      <option value="location" className="text-gray-900">Location</option>
                    </select>
                    {sortBy !== 'default' && (
                      <button
                        onClick={clearSort}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear sort"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
                {filteredRestaurants.map((restaurant) => (
                  <Restaurant
                    key={restaurant.id}
                    data={restaurant}
                  />
                ))}
                {filteredRestaurants.length === 0 && hasSearched && (
                  <div className="col-span-full text-center py-8 text-gray-500">
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
        console.log('Restaurant data with ratings:', data.map(r => ({
          id: r.id,
          name: r.name,
          rating: r.average_rating,
          reviews: r.review_count,
          menu_items: r.menu_item_count
        })));
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
