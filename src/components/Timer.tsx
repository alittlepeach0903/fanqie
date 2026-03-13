import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Pause, RotateCcw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimerProps {
  initialSeconds: number;
  taskName: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function Timer({ initialSeconds, taskName, onComplete, onCancel }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / initialSeconds) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-12 p-6">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Tomato Timer Body */}
        <motion.div 
          animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-tomato-red rounded-[45%] shadow-2xl shadow-tomato-red/30 overflow-hidden"
        >
          {/* Progress Fill (Water-like) */}
          <motion.div 
            initial={{ height: '100%' }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-[2px]"
          />
          
          {/* Shine */}
          <div className="absolute top-[15%] left-[20%] w-[25%] h-[12%] bg-white/30 rounded-full rotate-[-35deg] blur-[1px]" />
        </motion.div>

        {/* Leaf Stem */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-16 h-16">
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

        <div className="flex flex-col items-center z-10">
          <motion.span 
            key={timeLeft}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-black tracking-tighter text-white drop-shadow-lg"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-xs font-black text-white/60 mt-2 uppercase tracking-[0.3em] drop-shadow-sm">
            {isActive ? 'Focusing' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">{taskName}</h2>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-tomato-red animate-pulse" />
          <p className="text-gray-500 font-bold text-sm">Deep Focus Mode</p>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <button
          onClick={onCancel}
          className="p-4 rounded-2xl bg-white/50 text-gray-400 hover:text-tomato-cyan transition-all active:scale-95 shadow-sm"
        >
          <Square size={24} fill="currentColor" />
        </button>

        <button
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "p-8 rounded-3xl text-white transition-all transform active:scale-95 shadow-xl",
            isActive ? "bg-tomato-cyan" : "bg-tomato-red"
          )}
        >
          {isActive ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
        </button>

        <button
          onClick={() => setTimeLeft(initialSeconds)}
          className="p-4 rounded-2xl bg-white/50 text-gray-400 hover:text-tomato-red transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}
