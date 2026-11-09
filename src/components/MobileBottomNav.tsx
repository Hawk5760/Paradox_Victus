import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { sounds } from '../utils/soundEffects';
import {
  Home,
  CheckSquare,
  Compass,
  FlaskConical,
  Menu,
  X,
  Calendar,
  Clock,
  ShieldAlert,
  HeartPulse,
  Award,
  User,
  Activity,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAIAssistant: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAIAssistant,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'predictor', label: 'Predictor', icon: Compass },
    { id: 'simulator', label: 'Simulator', icon: FlaskConical },
  ];

  const allModules: { id: ActiveTab; label: string; subtitle: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home Billboard', subtitle: 'Main Campus & Banter', icon: <Home className="w-5 h-5 text-amber-400" /> },
    { id: 'dashboard', label: 'Attendance Overview', subtitle: '86% Safe Gauge', icon: <Activity className="w-5 h-5 text-emerald-400" />, badge: '86%' },
    { id: 'attendance', label: 'My Attendance Table', subtitle: '5 Subjects Record', icon: <CheckSquare className="w-5 h-5 text-sky-400" /> },
    { id: 'predictor', label: 'Bunk Predictor', subtitle: 'Smart AI Odds', icon: <Compass className="w-5 h-5 text-orange-400" /> },
    { id: 'timetable', label: 'Class Timetable', subtitle: 'Weekly Room Schedule', icon: <Clock className="w-5 h-5 text-blue-400" /> },
    { id: 'simulator', label: 'What-if Simulator', subtitle: 'Test Bunk Limits', icon: <FlaskConical className="w-5 h-5 text-purple-400" /> },
    { id: 'radar', label: 'Professor Radar', subtitle: 'Dubey Sir Strictness', icon: <ShieldAlert className="w-5 h-5 text-rose-500" />, badge: 'Hot' },
    { id: 'recovery', label: 'Recovery Plan', subtitle: 'Comeback Checklist', icon: <HeartPulse className="w-5 h-5 text-red-400" /> },
    { id: 'calendar', label: 'Bunk Calendar', subtitle: 'Safe Days in Nov 2026', icon: <Calendar className="w-5 h-5 text-teal-400" /> },
    { id: 'analytics', label: 'Attendance Analytics', subtitle: 'Trends & Charts', icon: <Activity className="w-5 h-5 text-indigo-400" /> },
    { id: 'achievements', label: 'Achievements', subtitle: '4 Gold Trophies', icon: <Award className="w-5 h-5 text-yellow-400" />, badge: '4' },
    { id: 'profile', label: 'Profile & Settings', subtitle: 'Bunty 2nd Year EEE', icon: <User className="w-5 h-5 text-purple-300" /> },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    sounds.playBoing();
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#17264A]/98 backdrop-blur-md border-t-2 border-[#FFD43B] shadow-[0_-4px_16px_rgba(0,0,0,0.5)] px-2 py-1.5 pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-colors duration-150 ${
                  isActive
                    ? 'text-[#17264A] bg-[#FFD43B] shadow-[0_2px_0_#d9b024] font-black -translate-y-1'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
                <span className="font-['Baloo_2'] text-[11px] leading-tight mt-0.5 font-bold">
                  {item.label}
                </span>
              </motion.button>
            );
          })}

          {/* More Modules Drawer Trigger */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              sounds.playPop();
              setDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-colors duration-150 ${
              drawerOpen
                ? 'text-[#17264A] bg-[#FFD43B] font-black -translate-y-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="font-['Baloo_2'] text-[11px] leading-tight mt-0.5 font-bold">
              Menu
            </span>
          </motion.button>
        </div>
      </nav>

      {/* Comic Mobile Bottom Sheet Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/75 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-[#17264A] rounded-t-3xl border-t-4 border-[#FFD43B] shadow-2xl p-4 max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#2d467c]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 aspect-square rounded-full bg-[#FFD43B] p-0.5 border border-white overflow-hidden shrink-0">
                    <img src="/assets/characters/bunty_avatar.png" alt="Bunty" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-['Baloo_2'] text-lg font-black text-[#FFD43B] leading-none">
                      College Modules 🏫
                    </h3>
                    <p className="text-[11px] text-slate-300 font-semibold">Choose your next college mission</p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => {
                    sounds.playPop();
                    setDrawerOpen(false);
                  }}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Quick Action: Talk to Bunty */}
              <div className="py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playSuccess();
                    setDrawerOpen(false);
                    onOpenAIAssistant();
                  }}
                  className="w-full bg-gradient-to-r from-[#FF963C] to-[#FFD43B] hover:brightness-105 text-[#17264A] p-2.5 rounded-2xl font-['Baloo_2'] text-sm font-black flex items-center justify-center gap-2 shadow-[0_3px_0_#cc742a] active:translate-y-0.5"
                >
                  <span>Talk to Bunty & Mic Jugaad 🎙️</span>
                </button>
              </div>

              {/* Grid of all 12 modules */}
              <div className="overflow-y-auto max-h-[55vh] pr-1 space-y-1.5 py-1">
                {allModules.map((mod) => {
                  const isSelected = activeTab === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleSelectTab(mod.id)}
                      className={`w-full text-left p-2.5 rounded-2xl flex items-center justify-between border-2 transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-[#FFD43B] text-[#17264A] border-white shadow-md font-black'
                          : 'bg-[#203460] text-white border-transparent hover:border-[#FFD43B]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#17264A] text-[#FFD43B]' : 'bg-[#17264A]/60'}`}>
                          {mod.icon}
                        </div>
                        <div>
                          <div className="font-['Baloo_2'] text-sm font-bold leading-tight">
                            {mod.label}
                          </div>
                          <div className={`text-[10px] font-semibold ${isSelected ? 'text-[#17264A]/80' : 'text-slate-300'}`}>
                            {mod.subtitle}
                          </div>
                        </div>
                      </div>

                      {mod.badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#17264A] text-[#FFD43B]' : 'bg-[#FFD43B] text-[#17264A]'}`}>
                          {mod.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
