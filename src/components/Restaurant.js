import React from "react";
import { Link } from "react-router-dom";
import '../styles/Restaurant.css';

export default function Restaurant({ data }) {
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
          <p className="text-gray-500 text-sm">Menu items coming soon...</p>
        )}
      </div>
    </Link>
  );
}
