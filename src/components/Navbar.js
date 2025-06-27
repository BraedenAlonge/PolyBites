import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userIcon from '../assets/Misc/User.png';

export default function Navbar({ onSignInOpen, onSignUpOpen }) {
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState('');
  const [userNames, setUserNames] = useState({});


  // useEffect(() => {
  //   const fetchUserName = async (userId) => {
  //     if (!userId) return;
      

  //     try {
  //       const response = await fetch(`http://localhost:5000/api/profiles/auth/${userId}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch profile');
  //       }
  //       const userData = await response.json();
  //       setUserName(userData.name);
  //     } catch (err) {
  //         console.error('Error fetching profile:', err);
  //         setUserName('User #' + userId);
  //     }
  //   };
  //   if (user?.id) {
  //     fetchUserName(user.id);
  //   }
  // }, [user?.id]);

  return (
    <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between h-14">
        {/* Logo or App Name */}
        <div className="flex items-center h-full">
          <Link to="/" className="text-3xl font-extrabold animate-fade-in pl-2 text-black hover:text-green-100 transition-colors">
            PolyBites 🍽️
          </Link>
        </div>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center space-x-4 gap-2">
            <Link
              to="/about"
              className=" text-white px-4 py-1.5 text-sm font-medium hover:bg-white/30 hover:rounded-full"
            >
              About
            </Link>
            {/* <Link
              to="/contact-us"
              className=" text-white px-4 py-1.5 text-sm font-medium hover:bg-white/30 hover:rounded-full"
            >
              Contact Us
            </Link> */}
            <Link
              to="/profile"
              className=" text-white px-2 py-0.5 text-sm font-medium hover:invert  flex items-center gap-2"
            >
              <img src={userIcon} alt="Profile" className="w-6 h-6" />
            </Link>
            <button
              onClick={logout}
              className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 pr-2">
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
                  style={{marginRight: 10}}
                >
                  Sign Up
                </button>

                <Link
                  to="/about"
                  className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  About
                </Link>
             </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}