import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Filter } from 'bad-words';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const filter = new Filter();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profiles/auth/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const profileData = await response.json();
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          email: user.email || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check for profanity in name
    if (filter.isProfane(formData.name)) {
      setError('Name contains inappropriate language. Please choose a different name.');
      return;
    }

    try {
      const requestBody = {
        name: formData.name
      };

      const response = await fetch(`http://localhost:5000/api/profiles/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating your profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link to="/" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-600 to-green-500 text-white py-16 relative">
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/" 
            className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Profile</h1>
          <p className="text-xl opacity-90">Manage your account settings</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Full Name</span>
                    <span className="text-gray-900 font-semibold text-lg">{profile?.name || 'Not set'}</span>
                  </div>

                  {/* Email */}
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email</span>
                    <span className="text-gray-900 text-lg">{user?.email}</span>
                  </div>

                  {/* User ID */}
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">User ID</span>
                    <span className="text-gray-900 text-lg">{user?.id}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-base"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 