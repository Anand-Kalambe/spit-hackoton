"use client"; 

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion'; // <-- Import Framer Motion

// Define the custom colors based on your image
const COLORS = {
  primaryBg: '#352D2A', 
  cardBg: '#4E433E',
  cardBorder: '#5A4F4A',
  buttonBg: '#6B5F5A',
  textLight: '#E0E0E0',
  textMuted: '#A0A0A0',
  inputBg: '#3F3633',
  inputBorder: '#5A4F4A',
};

// --- Framer Motion Variants ---

// 1. Main Card Spring Transition (Appears on page load)
const cardVariants = {
  initial: { scale: 0.9, opacity: 0, y: 50 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring' as const, 
      stiffness: 70, // Controls the speed of the snap
      damping: 15,    // Controls the amount of bounce
    }
  },
  tap: { scale: 0.99 },
};

// 2. Staggered Input Fade-in (Each input block)
const inputVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false); // For general animation/submit state

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAnimating(true); // Trigger animation on submit
    
    // Simulate API call or navigation
    setTimeout(() => {
      console.log('Login attempt:', { email, password });
      // In a real app, you'd use router.push('/dashboard') here
      setIsAnimating(false); // Reset animation state
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.primaryBg }}>
      <Head>
        <title>Login - Dashboard</title>
      </Head>

      {/* Mesmerizing Background Effect (Subtle Parallax) */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ease-in-out 
                   ${isAnimating ? 'scale-105' : 'scale-100'}`} // Subtle zoom animation on submit
        style={{ backgroundImage: `url('/login-bg.png')`, backgroundSize: 'cover' }} 
      ></div>
       <div className="absolute inset-0 bg-black opacity-30 z-10"></div> {/* Dark overlay */}

      {/* Login Card Container - Animated with Framer Motion */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        className={`relative z-20 p-8 rounded-xl shadow-2xl w-full max-w-md 
                   transform ${isAnimating ? '-translate-y-4 opacity-70' : 'translate-y-0 opacity-100'}`}
        style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}` }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.textLight }}>Welcome Back</h1>
          <p className="text-lg" style={{ color: COLORS.textMuted }}>Login to Dashboard</p>
        </div>

        {/* Form Container with Staggered Input Animation */}
        <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            // Stagger children animation (inputs appear one after another)
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Input: Username/Email - ANIMATED */}
          <motion.div variants={inputVariants}>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>
              Username or Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              style={{ backgroundColor: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textLight }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          {/* Input: Password - ANIMATED */}
          <motion.div variants={inputVariants} className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 pr-10"
              style={{ backgroundColor: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textLight }}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Optional: Eye icon */}
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" style={{ top: '60%', transform: 'translateY(-50%)' }}>
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </span>
          </motion.div>

          <Link href="/dashboard">
          <motion.button
            type="submit"
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.98 }}
            className={`w-full p-3 rounded-md font-semibold text-lg transition duration-300 ease-in-out mt-6 ${isAnimating ? 'opacity-70' : ''}`}
            style={{ backgroundColor: COLORS.buttonBg, color: COLORS.textLight, border: `1px solid ${COLORS.cardBorder}` }}
          >
            {isAnimating ? 'Logging In...' : 'Sign in'}
          </motion.button>
          </Link>
        </motion.form>

        {/* Forgot Password / Create Account links */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="#" className="hover:underline" style={{ color: COLORS.textMuted }}>Forgot Password?</a>
          <Link href="/register" className="hover:underline" style={{ color: COLORS.textMuted }}>Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;