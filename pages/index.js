// pages/index.js
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-[#0000FF] text-2xl font-bold">TAG</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Customer Section */}
              <div className="flex items-center space-x-2">
                <Link 
                  href="/auth/login"
                  className="text-gray-700 hover:text-[#0000FF]"
                >
                  Customer Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-gray-700 hover:text-[#0000FF]"
                >
                  Customer Sign Up
                </Link>
              </div>
              
              <span className="text-gray-300">|</span>
              
              {/* Business Section */}
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/business/login"
                  className="text-gray-700 hover:text-[#0000FF]"
                >
                  Business Sign In
                </Link>
                <Link
                  href="/auth/business/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0000FF] hover:bg-blue-700"
                >
                  Business Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Main Image */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Book your next cut with</span>
              <span className="block text-[#0000FF]">TAG</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connect with top barbers in your area. Easy booking, instant confirmations.
            </p>
          </div>

          {/* Main Hero Image */}
          <div className="mt-8">
            <Image
              src="/images/landing1.jpg"
              alt="TAG Barbershop Experience"
              width={1200}
              height={600}
              priority
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Additional Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="relative h-64">
              <Image
                src="/images/landing2.jpg"
                alt="TAG Barbershop Service"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="relative h-64">
              <Image
                src="/images/landing3.jpg"
                alt="TAG Barbershop Interior"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="relative h-64">
              <Image
                src="/images/landing4.jpg"
                alt="TAG Barbershop Experience"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/client/book"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0000FF] hover:bg-blue-700"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto text-[#0000FF]">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Find a Barber</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Browse through our network of professional barbers
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto text-[#0000FF]">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Book Appointment</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Select your preferred time and service
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto text-[#0000FF]">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Get Your Cut</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Show up and get the perfect cut
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0000FF]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to look your best?</span>
            <span className="block text-blue-200">Book your appointment today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/client/book"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#0000FF] bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-900">
            Powered by The Retici Group
          </p>
        </div>
      </footer>
    </div>
  )
}