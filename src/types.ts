export type ActiveTab =
  | 'home'
  | 'dashboard'
  | 'attendance'
  | 'predictor'
  | 'timetable'
  | 'simulator'
  | 'radar'
  | 'recovery'
  | 'calendar'
  | 'analytics'
  | 'achievements'
  | 'profile';

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  attended: number;
  total: number;
  room: string;
  professor: string;
}

export interface StudentProfile {
  name: string;
  role: string;
  college: string;
  threshold: number;
  notifications: boolean;
  darkMode: boolean;
}

export interface TimetableEntry {
  id: string;
  time: string;
  subject: string;
  room: string;
  isBreak?: boolean;
  attendedStatus?: 'attended' | 'bunked' | 'pending';
}

export interface ProfessorInfo {
  id: string;
  name: string;
  subject: string;
  strictness: 'Very High' | 'High' | 'Medium' | 'Low';
  bunkRisk: "Don't Bunk" | 'Risky' | 'Possible' | 'Safe';
  catchProbability: number;
  quote: string;
  tip: string;
  avatarSeed: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'smart_bunker' | 'attendance_hero' | 'recovery_king' | 'timetable_pro' | 'canteen_legend' | 'dubey_dodger';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}
