import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSignInOpen, onSignUpOpen }) {
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
    <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between h-16 px-4">
        {/* Logo or App Name */}
        <div className="flex items-center h-full">
          <span className="text-3xl font-extrabold animate-fade-in pl-2 text-black">PolyBites 🍽️</span>
        </div>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center space-x-4 pr-2">
            <span className="text-white">Welcome, {userName.split(' ')[0] || 'Guest'}</span>
            <button
              onClick={logout}
              className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 pr-2">
            <span className="text-white">Welcome, Guest</span>

            {user ?
              (
              <div>
                <button
                  onClick={logout}
                  className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Sign Out
                </button>
                </div>
                ) : (
              <div>
                <button
                  onClick={onSignInOpen}
                  className="bg-black text-white-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-black-50 transition-colors"
                  style={{marginRight: 10}}
                >
                  Sign In
                </button>

                <button
                  onClick={onSignUpOpen}
                  className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Sign Up
                </button>
             </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}