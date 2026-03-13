export interface PomodoroSession {
  id: string;
  startTime: number;
  duration: number; // in seconds
  taskName: string;
  status: 'completed' | 'abandoned';
  date: string; // ISO date string
}

export interface VoiceCommandResult {
  durationMinutes: number;
  taskName: string;
}
