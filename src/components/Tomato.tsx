import React from 'react';
import { motion } from 'motion/react';

interface TomatoProps {
  onClick: () => void;
  size?: 'sm' | 'lg';
}

export default function Tomato({ onClick, size = 'lg' }: TomatoProps) {
  const isLarge = size === 'lg';
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative flex items-center justify-center ${isLarge ? 'w-64 h-64' : 'w-16 h-16'}`}
    >
      {/* Tomato Leaf Stem */}
      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 ${isLarge ? 'w-12 h-12' : 'w-3 h-3'}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <path 
            d="M50 80 C50 50 30 30 10 20 M50 80 C50 50 70 30 90 20 M50 80 C50 40 50 10 50 0" 
            stroke="#27AE60" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
      
      {/* Tomato Body */}
      <div className={`w-full h-full bg-tomato-red rounded-[45%] shadow-2xl shadow-tomato-red/40 flex items-center justify-center overflow-hidden relative`}>
        {/* Shine */}
        <div className="absolute top-[15%] left-[20%] w-[25%] h-[12%] bg-white/40 rounded-full rotate-[-35deg] blur-[1px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[15%] h-[8%] bg-white/10 rounded-full rotate-[145deg] blur-[2px]" />
        
        {isLarge && (
          <div className="flex flex-col items-center space-y-1 z-10">
            <span className="text-white font-black text-4xl tracking-widest uppercase drop-shadow-md">
              START
            </span>
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        )}
      </div>
    </motion.button>
  );
}
