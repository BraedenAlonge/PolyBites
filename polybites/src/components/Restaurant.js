import React from "react";
import '../styles/Restaurant.css';

export default function Restaurant({ data, onClick }) {
  return (
    <div
      className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
      onClick={onClick}
    >
      <img
        src={data.image}
        alt={data.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold">{data.name}</h2>
        <p className="text-yellow-600">Rating: {data.rating} ⭐</p>
      </div>
    </div>
  );
}
