import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'motion/react';
import { PomodoroSession } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HistoryProps {
  sessions: PomodoroSession[];
}

export default function History({ sessions }: HistoryProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getSessionsForDay = (day: Date) => {
    return sessions.filter((s) => isSameDay(parseISO(s.date), day));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(today, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-tomato-red" />
            <span>Done</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-tomato-cyan" />
            <span>Left</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-xs font-bold text-gray-300 py-2">
            {d}
          </div>
        ))}
        {days.map((day, idx) => {
          const daySessions = getSessionsForDay(day);
          const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.01 }}
              className={cn(
                "aspect-square rounded-2xl p-1 flex flex-col items-center justify-start border border-transparent transition-colors",
                isCurrentMonth ? "bg-white" : "bg-transparent opacity-30",
                isSameDay(day, today) && "border-tomato-soft border-2"
              )}
            >
              <span className="text-[10px] font-bold text-gray-400 mb-1">
                {format(day, 'd')}
              </span>
              <div className="grid grid-cols-2 gap-0.5 w-full px-0.5">
                {daySessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "w-full aspect-square rounded-full",
                      s.status === 'completed' ? "bg-tomato-red" : "bg-tomato-cyan"
                    )}
                  />
                ))}
                {daySessions.length > 4 && (
                  <div className="w-full aspect-square flex items-center justify-center text-[8px] font-bold text-gray-400">
                    +{daySessions.length - 4}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
        <div className="space-y-3">
          {sessions.slice().reverse().slice(0, 5).map((session) => (
            <div key={session.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  session.status === 'completed' ? "bg-tomato-red/10 text-tomato-red" : "bg-tomato-cyan/10 text-tomato-cyan"
                )}>
                  <div className="w-5 h-5 rounded-full bg-current" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{session.taskName}</p>
                  <p className="text-xs text-gray-400">{format(parseISO(session.date), 'MMM d, HH:mm')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{Math.round(session.duration / 60)}m</p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-tighter",
                  session.status === 'completed' ? "text-tomato-red" : "text-tomato-cyan"
                )}>
                  {session.status}
                </p>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 italic">No sessions recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
