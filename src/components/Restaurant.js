import React from "react";
import '../styles/Restaurant.css';

export default function Restaurant({ data, onClick }) {
  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
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
        <h2 className="text-xl font-bold text-gray-800 mb-2">{data.name}</h2>
        <div className="flex items-center justify-between">
          <span className="text-green-600 text-sm font-medium">
            {data.reviews.length} Reviews
          </span>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
