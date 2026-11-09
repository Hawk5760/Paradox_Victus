import React, { useState } from 'react';
import { ActiveTab, StudentProfile, SubjectItem } from './types';
import { calculateOverallAttendance } from './utils/bunkCalculator';
import { sounds } from './utils/soundEffects';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ThreeCanvas } from './components/ThreeCanvas';
import { AIAssistantModal } from './components/AIAssistantModal';

import { motion, AnimatePresence } from 'framer-motion';
import { comicPageVariants } from './utils/comicAnimations';

// 12 Mockup Views
import { LandingHomeView } from './views/LandingHomeView';
import { DashboardView } from './views/DashboardView';
import { AttendanceView } from './views/AttendanceView';
import { BunkPredictorView } from './views/BunkPredictorView';
import { TimetableView } from './views/TimetableView';
import { WhatIfSimulatorView } from './views/WhatIfSimulatorView';
import { ProfessorRadarView } from './views/ProfessorRadarView';
import { RecoveryPlanView } from './views/RecoveryPlanView';
import { BunkCalendarView } from './views/BunkCalendarView';
import { AnalyticsView } from './views/AnalyticsView';
import { AchievementsView } from './views/AchievementsView';
import { ProfileSettingsView } from './views/ProfileSettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(75);

  const [profile, setProfile] = useState<StudentProfile>({
    name: 'Bunty',
    role: '2nd Year • EEE',
    college: 'GIT College, Belgaum',
    threshold: 75,
    notifications: true,
    darkMode: false,
  });

  // Default subjects matching mockup values exactly:
  // Mathematics: 22/28 (78%)
  // EEE: 21/28 (75%)
  // Physics: 24/28 (86%)
  // Programming: 26/28 (93%)
  // English: 20/28 (71%)
  // Subject values matching mockup Screen 3:
  // Mathematics: 22/28 (78% Safe)
  // EEE: 21/28 (75% Borderline)
  // Physics: 24/28 (86% Safe)
  // Programming: 26/28 (93% Great)
  // English: 20/28 (71% At Risk)
  const [subjects, setSubjects] = useState<SubjectItem[]>([
    {
      id: 'maths',
      name: 'Mathematics',
      code: 'MATH201',
      attended: 22,
      total: 28,
      room: 'Room A-102',
      professor: "Mehta Ma'am",
    },
    {
      id: 'eee',
      name: 'EEE',
      code: 'EEE202',
      attended: 21,
      total: 28,
      room: 'Room B-204',
      professor: 'Dubey Sir',
    },
    {
      id: 'phy',
      name: 'Physics',
      code: 'PHY203',
      attended: 24,
      total: 28,
      room: 'Lab P-2',
      professor: 'Kulkarni Sir',
    },
    {
      id: 'prog',
      name: 'Programming',
      code: 'CS204',
      attended: 26,
      total: 28,
      room: 'Lab L1',
      professor: 'Sharma Sir',
    },
    {
      id: 'eng',
      name: 'English',
      code: 'ENG205',
      attended: 20,
      total: 28,
      room: 'Room A-106',
      professor: 'Rao Sir',
    },
  ]);

  // Overall attendance calculation
  const summary = calculateOverallAttendance(
    subjects.map((s) => ({
      id: s.id,
      name: s.name,
      attended: s.attended,
      total: s.total,
    })),
    threshold,
    120
  );

  return (
    <div className={`min-h-screen flex flex-col font-['Nunito',sans-serif] ${profile.darkMode ? 'bg-[#0f1930] text-white' : 'bg-[#17264A] text-slate-900'}`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
      />

      {/* Main Content View with Ambient 3D Three.js Layer */}
      <main className="flex-1 relative flex flex-col justify-center">
        {/* Ambient 3D Three.js canvas in background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <ThreeCanvas sceneType="campus" />
        </div>

        {/* View Switcher based on active tab with comic-pop transition */}
        <div className="relative z-10 flex-1 flex flex-col justify-center overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={comicPageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-center"
            >
              {activeTab === 'home' && (
                <LandingHomeView
                  summary={summary}
                  profile={profile}
                  setActiveTab={setActiveTab}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardView
                  summary={summary}
                  profile={profile}
                  subjects={subjects}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceView
                  subjects={subjects}
                  setSubjects={setSubjects}
                  threshold={threshold}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'predictor' && (
                <BunkPredictorView
                  subjects={subjects}
                  threshold={threshold}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'timetable' && (
                <TimetableView
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'simulator' && (
                <WhatIfSimulatorView
                  totalClasses={120}
                  attendedClasses={104}
                  threshold={threshold}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'radar' && (
                <ProfessorRadarView
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'recovery' && (
                <RecoveryPlanView
                  subjects={subjects}
                  threshold={threshold}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'calendar' && (
                <BunkCalendarView
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  subjects={subjects}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementsView
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileSettingsView
                  profile={profile}
                  setProfile={setProfile}
                  threshold={threshold}
                  setThreshold={setThreshold}
                  setActiveTab={setActiveTab}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile-Optimized Bottom Navigation Bar (md:hidden) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
      />

      {/* Floating Bunty AI Trigger Button (Elevated above mobile nav on phones) */}
      <button
        type="button"
        onClick={() => {
          sounds.playBoing();
          setIsAIAssistantOpen(true);
        }}
        className="fixed bottom-18 md:bottom-8 right-3 sm:right-6 z-40 bg-[#FFD43B] hover:bg-[#ffe066] text-[#17264A] p-2.5 sm:px-4 sm:py-3 rounded-full shadow-[0_5px_0_#d9b024,0_10px_20px_rgba(0,0,0,0.4)] border-3 border-[#17264A] flex items-center gap-2 transition-all hover:scale-105 active:translate-y-1 active:shadow-none group animate-bounce-short"
        title="Chat with Bunty & Transcribe Voice with Gemini AI"
      >
        <div className="w-8 h-8 aspect-square rounded-full overflow-hidden border-2 border-[#17264A] bg-white shrink-0 shadow-xs">
          <img
            src="/assets/characters/bunty_avatar.png"
            alt="Bunty"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-['Baloo_2'] text-xs sm:text-base font-black hidden sm:inline">
          Ask Bunty 🎙️
        </span>
      </button>

      {/* Interactive AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        subjects={subjects}
        threshold={threshold}
        totalClasses={summary.totalClasses}
        attendedClasses={summary.attendedClasses}
      />
    </div>
  );
}
