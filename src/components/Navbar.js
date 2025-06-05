import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSignInOpen }) {
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async (userId) => {
      if (!userId) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/profiles/auth/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const userData = await response.json();
        setUserName(userData.name);
      } catch (err) {
          console.error('Error fetching profile:', err);
          setUserName('User #' + userId);
      }
    };

    if (user?.id) {
      fetchUserName(user.id);
    }
  }, [user?.id]);

  return (
    <header className="bg-green-600 text-white shadow-lg py-2 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
        <h1 className="text-3xl font-bold">Poly Bites 🍽️</h1>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {userName.split(' ')[0] || 'Guest'}</span>
            <button
              onClick={logout}
              className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
          <span className="text-white">Welcome, Guest</span>

          <button
            onClick={onSignInOpen}
            className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Sign In
          </button>
          </div>
        )}
      </div>
    </header>
  );
}