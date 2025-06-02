import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Restaurant from "./components/Restaurant";
import RestaurantDetails from "./components/RestaurantDetails";
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
    menuItems: [
      {
        id: 1,
        name: "Avocado Toast",
        price: 12.99,
        image: brunchImage,
        description: "Fresh avocado on sourdough toast with poached eggs and microgreens",
        details: ["Vegetarian", "Locally sourced bread", "Free-range eggs"],
        reviews: [
          { rating: 5, author: "Emma S.", text: "Best avocado toast in town!" },
          { rating: 4, author: "Mike R.", text: "Fresh and delicious" }
        ]
      },
      {
        id: 2,
        name: "Eggs Benedict",
        price: 14.99,
        image: brunchImage,
        description: "Classic eggs benedict with hollandaise sauce and Canadian bacon",
        details: ["House-made hollandaise", "Free-range eggs", "Served with potatoes"],
        reviews: [
          { rating: 5, author: "Sarah L.", text: "Perfect hollandaise!" },
          { rating: 4, author: "John D.", text: "A brunch classic done right" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Hearth",
    image: hearthImage,
    rating: 4.2,
    menuItems: [
      {
        id: 1,
        name: "Classic Burger",
        price: 15.99,
        image: hearthImage,
        description: "Hand-formed patty with lettuce, tomato, onion, and special sauce",
        details: ["1/3 lb Angus beef", "House-made sauce", "Brioche bun"],
        reviews: [
          { rating: 5, author: "Tom H.", text: "Juiciest burger ever!" },
          { rating: 4, author: "Lisa M.", text: "Great classic burger" }
        ]
      },
      {
        id: 2,
        name: "Truffle Fries",
        price: 8.99,
        image: hearthImage,
        description: "Hand-cut fries tossed with truffle oil and parmesan",
        details: ["House-cut potatoes", "Italian truffle oil", "Aged parmesan"],
        reviews: [
          { rating: 5, author: "Alex K.", text: "Addictively good!" },
          { rating: 5, author: "Maria C.", text: "Perfect amount of truffle" }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Noodles",
    image: noodlesImage,
    rating: 4.3,
    menuItems: [
      {
        id: 1,
        name: "Ramen",
        price: 13.99,
        image: noodlesImage,
        description: "Traditional ramen with rich pork broth and fresh noodles",
        details: ["24-hour broth", "House-made noodles", "Chashu pork"],
        reviews: [
          { rating: 5, author: "David L.", text: "Authentic taste!" },
          { rating: 4, author: "Jenny W.", text: "Amazing broth" }
        ]
      },
      {
        id: 2,
        name: "Pad Thai",
        price: 12.99,
        image: noodlesImage,
        description: "Classic pad thai with rice noodles, tofu, and peanuts",
        details: ["Rice noodles", "House-made sauce", "Fresh bean sprouts"],
        reviews: [
          { rating: 5, author: "Kate P.", text: "Perfect balance of flavors" },
          { rating: 4, author: "Ryan M.", text: "Great portion size" }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Balance",
    image: balanceImage,
    rating: 4.7,
    menuItems: [
      {
        id: 1,
        name: "Quinoa Bowl",
        price: 13.99,
        image: balanceImage,
        description: "Fresh quinoa bowl with roasted vegetables and tahini dressing",
        details: ["Vegan", "Gluten-free", "High protein"],
        reviews: [
          { rating: 5, author: "Rachel G.", text: "So fresh and filling!" },
          { rating: 4, author: "Chris P.", text: "Great healthy option" }
        ]
      },
      {
        id: 2,
        name: "Green Smoothie",
        price: 7.99,
        image: balanceImage,
        description: "Nutrient-packed smoothie with spinach, banana, and almond milk",
        details: ["Dairy-free", "No added sugar", "Vitamin rich"],
        reviews: [
          { rating: 5, author: "Sam T.", text: "Perfect post-workout drink" },
          { rating: 4, author: "Linda K.", text: "Tastes great and healthy" }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Grand Avenue Deli",
    image: deliImage,
    rating: 4.1,
    menuItems: [
      {
        id: 1,
        name: "Classic Reuben",
        price: 12.99,
        image: deliImage,
        description: "Traditional Reuben with corned beef, sauerkraut, and Russian dressing",
        details: ["House-made corned beef", "Fresh rye bread", "Swiss cheese"],
        reviews: [
          { rating: 5, author: "Mark L.", text: "Best Reuben in town!" },
          { rating: 4, author: "Amy S.", text: "Great sandwich" }
        ]
      },
      {
        id: 2,
        name: "Matzo Ball Soup",
        price: 6.99,
        image: deliImage,
        description: "Classic matzo ball soup with tender chicken and vegetables",
        details: ["Family recipe", "Made fresh daily", "Comfort food"],
        reviews: [
          { rating: 5, author: "David M.", text: "Just like grandma's" },
          { rating: 4, author: "Sarah B.", text: "Perfect for cold days" }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Jamba Juice",
    image: jambaImage,
    rating: 4.1,
    menuItems: [
      {
        id: 1,
        name: "Mango-a-go-go",
        price: 6.99,
        image: jambaImage,
        description: "Refreshing mango smoothie with passion fruit and orange sherbet",
        details: ["Real fruit", "No artificial flavors", "Vitamin C boost"],
        reviews: [
          { rating: 5, author: "Julie R.", text: "So refreshing!" },
          { rating: 4, author: "Mike T.", text: "Perfect summer drink" }
        ]
      },
      {
        id: 2,
        name: "Protein Berry Workout",
        price: 7.99,
        image: jambaImage,
        description: "Protein-packed smoothie with strawberries and whey protein",
        details: ["20g protein", "All natural", "Post-workout favorite"],
        reviews: [
          { rating: 5, author: "Tim F.", text: "Great after the gym" },
          { rating: 4, author: "Laura H.", text: "Filling and nutritious" }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Streats",
    image: "https://source.unsplash.com/400x300/?streetfood",
    rating: 4.0,
    reviews: [
      { id: 1, text: "Quick and tasty bites!" },
      { id: 2, text: "Great for a casual meal." },
    ],
  },
  {
    id: 8,
    name: "Mingle",
    image: "https://source.unsplash.com/400x300/?cafe",
    rating: 3.9,
    reviews: [
      { id: 1, text: "Cozy atmosphere." },
      { id: 2, text: "Good coffee and pastries." },
    ],
  },
  {
    id: 9,
    name: "Nosh",
    image: "https://source.unsplash.com/400x300/?diner",
    rating: 4.1,
    reviews: [
      { id: 1, text: "Classic diner food done right." },
      { id: 2, text: "Great milkshakes!" },
    ],
  },
  {
    id: 10,
    name: "Vista Grande Express",
    image: "https://source.unsplash.com/400x300/?diner",
    rating: 4.1,
    reviews: [
      { id: 1, text: "Classic diner food done right." },
      { id: 2, text: "Great milkshakes!" },
    ],
  },
];

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

function HomePage() {
  return (
    <main className="container mx-auto px-4 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ paddingBottom: '1rem' }}>
        {dummyRestaurants.map((restaurant) => (
          <Restaurant
            key={restaurant.id}
            data={restaurant}
          />
        ))}
      </div>
    </main>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/restaurant-reviews');
        const data = await response.json();
        setUsers(data);
        console.log('Restaurants:', data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/restaurant/:id" 
            element={<RestaurantDetails restaurants={dummyRestaurants} />} 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
