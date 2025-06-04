import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Restaurant.css';

//function to fetch foods from a restaurnat and count the number of items
const fetchNumberOfFoods = async (restaurantId) => {
  const response = await fetch(`http://localhost:5000/api/foods/restaurant/${restaurantId}`);
  const data = await response.json();
  return data.length;
};

export default function Restaurant({ data }) {
  const [menuItemCount, setMenuItemCount] = useState(0);

  useEffect(() => {
    const getMenuItemCount = async () => {
      if (!data.menuItems) {
        const count = await fetchNumberOfFoods(data.id);
        setMenuItemCount(count);
      }
    };

    getMenuItemCount();
  }, [data.id, data.menuItems]);

  return (
    <Link
      to={`/restaurant/${data.id}`}
      className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 m-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {data.rating} ⭐
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{data.name}</h2>
        {!data.menuItems && (
          <p className="text-gray-500 text-sm"><strong>{menuItemCount}</strong> menu items</p>
        )}
      </div>
    </Link>
  );
}
