// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">BarberBook</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => window.location.href = '/signup'}
              >
                Register Your Shop
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Find a Barbershop</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Sample shops - would be populated from API */}
              <ShopCard
                name="Classic Cuts"
                rating={4.5}
                price="$25+"
                location="Downtown"
              />
              <ShopCard
                name="Modern Barbershop"
                rating={4.8}
                price="$30+"
                location="Westside"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ShopCard({ name, rating, price, location }) {
  const router = useRouter();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-4">
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{location}</p>
        <div className="mt-4">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-sm text-gray-500">{rating}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-sm text-gray-500">Starting at {price}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <button
          onClick={() => router.push(`/book/${name.toLowerCase().replace(' ', '-')}`)}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}