// This directive is crucial for using useState in the App Router
"use client"; 

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'; // For linking to the login page

// Define the custom colors based on your image (same as login page for consistency)
const COLORS = {
  primaryBg: '#352D2A', // Main dark brown background
  cardBg: '#4E433E',    // Card background
  cardBorder: '#5A4F4A', // Card border
  buttonBg: '#6B5F5A',  // Button background (slightly lighter for contrast)
  buttonHover: '#7C6F6A', // Button hover state
  textLight: '#E0E0E0', // Light text for contrast
  textMuted: '#A0A0A0', // Muted text for secondary info
  inputBg: '#3F3633',   // Input field background
  inputBorder: '#5A4F4A', // Input field border
};

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false); // For triggering animations

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // Explicitly type the event
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsAnimating(true); // Trigger animation on submit
    // Simulate API call for registration
    setTimeout(() => {
      console.log('Registration attempt:', { fullName, email, password });
      // In a real app, you'd handle registration logic here
      // After successful registration, you'd typically redirect to login or dashboard
      // router.push('/login'); 
      setIsAnimating(false); // Reset animation state
      alert("Registration successful! Please log in.");
      // Optionally clear fields
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.primaryBg }}>
      <Head>
        <title>Register - Dashboard</title>
      </Head>

      {/* Mesmerizing Background Effect (Same as Login Page) */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ease-in-out 
                   ${isAnimating ? 'scale-105' : 'scale-100'}`} // Subtle zoom animation on submit
        style={{ backgroundImage: `url('/login-bg.png')`, backgroundSize: 'cover' }} 
        // Ensure 'login-bg.png' is in your `public` folder.
      ></div>
       <div className="absolute inset-0 bg-black opacity-30 z-10"></div> {/* Dark overlay */}

      {/* Register Card Container */}
      <div 
        className={`relative z-20 p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-700 ease-out 
                   transform ${isAnimating ? '-translate-y-4 opacity-70' : 'translate-y-0 opacity-100'}`}
        style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}` }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.textLight }}>Join Us</h1>
          <p className="text-lg" style={{ color: COLORS.textMuted }}>Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              style={{ backgroundColor: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textLight }}
              placeholder="Your full name"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} // Explicitly type the event
              required
            />
          </div>

          {/* Email Address Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              style={{ backgroundColor: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textLight }}
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // Explicitly type the event
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 pr-10"
              style={{ backgroundColor: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textLight }}
              placeholder="Create a password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Explicitly type the event
              required
            />
            {/* Optional: Eye icon for password visibility toggle */}
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" style={{ top: '60%', transform: 'translateY(-50%)' }}>
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </span>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 pr-10"
              style={{ backgroundColor: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textLight }}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} // Explicitly type the event
              required
            />
            {/* Optional: Eye icon */}
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" style={{ top: '60%', transform: 'translateY(-50%)' }}>
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full p-3 rounded-md font-semibold text-lg transition duration-300 ease-in-out hover:scale-105"
            style={{ backgroundColor: COLORS.buttonBg, color: COLORS.textLight, border: `1px solid ${COLORS.cardBorder}` }}
          >
            Register
          </button>
        </form>

        {/* Already have an account? link */}
        <div className="mt-6 text-center text-sm">
          <span style={{ color: COLORS.textMuted }}>Already have an account? </span>
          <Link href="/login" className="hover:underline" style={{ color: COLORS.textMuted }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;