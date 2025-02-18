"use client";
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { ThemeContext } from '../ThemeProvider';

const Welcome = () => {
    const { user } = useContext(ThemeContext);

    return (
        <motion.div
            className="bg-gradient-to-r from-mainColor via-mainColor to-[skyblue] my-3 py-12 px-8 sm:px-6 rounded-lg flex flex-col justify-center items-center text-center"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.h1
                className="text-2xl font-extrabold text-white mb-4 sm:text-3xl xl:text-4xl leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
            >
                {user ? `Welcome back, ${user.username}` : 'Welcome to Your News Feed'}
            </motion.h1>
            <motion.p
                className="text-lg text-white mb-6 sm:text-xl xl:text-2xl max-w-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
            >
                {user
                    ? 'Discover, share, and engage with news from across the globe. Thank you for being a part of our community.'
                    : 'Discover, share, and engage with news from across the globe. Be the journalist, share your voice, and stay informed.'}
            </motion.p>
            <motion.div
                className="flex gap-4 flex-col sm:flex-row"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
            >
                <button className="bg-white text-mainColor cursor-default transition-all px-5 py-3 rounded-lg font-semibold shadow-lg w-full sm:w-auto">
                    Explore Latest News 
                    {/* <ChevronDown className="inline-block ml-2" /> */}
                </button>
                {user ? (
                    <Link href={`/profile/${user.username}`}>
                        <button className="border-2 shadow-lg border-white text-white hover:bg-white hover:text-mainColor transition-all p-3 rounded-lg font-semibold w-full sm:w-auto">
                            Go to your profile
                        </button>
                    </Link>
                ) : (
                    <Link href="/login">
                        <button className="border-2 shadow-lg border-white text-white hover:bg-white hover:text-mainColor transition-all p-3 rounded-lg font-semibold w-full sm:w-auto">
                            Log in to be part of the conversation
                        </button>
                    </Link>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Welcome;