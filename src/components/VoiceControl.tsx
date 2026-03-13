import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseVoiceCommand } from '../services/geminiService';
import { VoiceCommandResult } from '../types';

interface VoiceControlProps {
  onCommand: (result: VoiceCommandResult) => void;
}

export default function VoiceControl({ onCommand }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN'; // Default to Chinese as per request
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setError(null);
    };

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      setIsProcessing(true);
      
      const result = await parseVoiceCommand(text);
      if (result) {
        onCommand(result);
      } else {
        setError("Could not understand the command. Try again?");
      }
      setIsProcessing(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setError(`Error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onCommand]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        {(isListening || isProcessing || error || transcript) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20 min-w-[280px] text-center"
          >
            {isListening && (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 16, 8] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                      className="w-1 bg-tomato-red rounded-full"
                    />
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-600">Listening...</p>
              </div>
            )}
            {isProcessing && (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="animate-spin text-tomato-cyan" size={24} />
                <p className="text-sm font-bold text-gray-600">Processing command...</p>
              </div>
            )}
            {transcript && !isProcessing && !isListening && (
              <p className="text-sm font-medium text-gray-800 italic">"{transcript}"</p>
            )}
            {error && (
              <p className="text-xs font-bold text-tomato-red mt-1">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center group">
        <span className="mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Tap to speak
        </span>
        <button
          onClick={isListening ? undefined : startListening}
          disabled={isProcessing}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90",
            isListening ? "bg-tomato-red animate-pulse" : "bg-white text-tomato-red hover:bg-tomato-red hover:text-white"
          )}
        >
          {isListening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
      </div>
    </div>
  );
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
