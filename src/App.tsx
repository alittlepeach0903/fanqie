import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History as HistoryIcon, X, Sparkles, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Timer from './components/Timer';
import History from './components/History';
import VoiceControl from './components/VoiceControl';
import Tomato from './components/Tomato';
import { PomodoroSession, VoiceCommandResult } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    const saved = localStorage.getItem('pomodoro_sessions');
    if (saved) return JSON.parse(saved);
    
    const now = new Date();
    const mock: PomodoroSession[] = [
      { id: '1', startTime: Date.now(), duration: 1500, taskName: 'Interview Prep', status: 'completed', date: new Date(now.setDate(now.getDate() - 1)).toISOString() },
      { id: '2', startTime: Date.now(), duration: 1500, taskName: 'React Study', status: 'completed', date: new Date(now.setDate(now.getDate() - 1)).toISOString() },
      { id: '3', startTime: Date.now(), duration: 1500, taskName: 'Design Work', status: 'abandoned', date: new Date(now.setDate(now.getDate() - 2)).toISOString() },
      { id: '4', startTime: Date.now(), duration: 1500, taskName: 'Reading', status: 'completed', date: new Date(now.setDate(now.getDate() - 3)).toISOString() },
    ];
    return mock;
  });
  
  const [currentTimer, setCurrentTimer] = useState<{
    duration: number;
    taskName: string;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('pomodoro_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleVoiceCommand = useCallback((result: VoiceCommandResult) => {
    setCurrentTimer({
      duration: result.durationMinutes * 60,
      taskName: result.taskName,
      startTime: Date.now(),
    });
    setIsHistoryOpen(false);
  }, []);

  const completeSession = useCallback(() => {
    if (!currentTimer) return;

    const newSession: PomodoroSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: currentTimer.startTime,
      duration: currentTimer.duration,
      taskName: currentTimer.taskName,
      status: 'completed',
      date: new Date().toISOString(),
    };

    setSessions((prev) => [...prev, newSession]);
    setCurrentTimer(null);
  }, [currentTimer]);

  const cancelSession = useCallback(() => {
    if (!currentTimer) return;

    const newSession: PomodoroSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: currentTimer.startTime,
      duration: currentTimer.duration,
      taskName: currentTimer.taskName,
      status: 'abandoned',
      date: new Date().toISOString(),
    };

    setSessions((prev) => [...prev, newSession]);
    setCurrentTimer(null);
  }, [currentTimer]);

  const startDefaultSession = () => {
    setCurrentTimer({
      duration: 25 * 60,
      taskName: "Focus Session",
      startTime: Date.now(),
    });
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-bg-fresh flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-tomato-red rounded-xl flex items-center justify-center shadow-lg shadow-tomato-red/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">FreshPomodoro</h1>
        </div>
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="p-3 rounded-2xl bg-white/50 hover:bg-white text-gray-600 shadow-sm transition-all active:scale-95"
        >
          <HistoryIcon size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pb-20">
        <AnimatePresence mode="wait">
          {currentTimer ? (
            <motion.div
              key="timer-active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <Timer
                initialSeconds={currentTimer.duration}
                taskName={currentTimer.taskName}
                onComplete={completeSession}
                onCancel={cancelSession}
              />
            </motion.div>
          ) : (
            <motion.div
              key="timer-idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center space-y-12"
            >
              <Tomato onClick={startDefaultSession} />
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Tap to Focus</h2>
                <p className="text-gray-500 font-medium px-12">
                  Or use voice to set a custom timer
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* History Modal / Slide-up Panel */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-bg-fresh rounded-t-[3rem] shadow-2xl z-50 h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="w-full h-12 flex items-center justify-center cursor-pointer" onClick={() => setIsHistoryOpen(false)}>
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <History sessions={sessions} />
              </div>
              
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-400"
              >
                <X size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Voice Control Overlay */}
      <VoiceControl onCommand={handleVoiceCommand} />
    </div>
  );
}
