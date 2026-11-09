import React, { useState } from 'react';
import { ActiveTab, StudentProfile } from '../types';
import { sounds } from '../utils/soundEffects';
import { Volume2, VolumeX, ChevronDown, Sparkles, BookOpen, Clock, Activity, Award, User, Calendar, ShieldAlert, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenAIAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  soundEnabled,
  setSoundEnabled,
  onOpenAIAssistant,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const mainNavItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'predictor', label: 'Bunk Predictor' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'simulator', label: 'Simulator' },
  ];

  const secondaryNavItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { id: 'radar', label: 'Professor Radar', icon: <ShieldAlert className="w-4 h-4 text-amber-400" /> },
    { id: 'recovery', label: 'Recovery Plan', icon: <HeartPulse className="w-4 h-4 text-rose-400" /> },
    { id: 'calendar', label: 'Bunk Calendar', icon: <Calendar className="w-4 h-4 text-sky-400" /> },
    { id: 'analytics', label: 'Attendance Analytics', icon: <Activity className="w-4 h-4 text-purple-400" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { id: 'profile', label: 'Profile & Settings', icon: <User className="w-4 h-4 text-indigo-400" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    sounds.playPop();
    setActiveTab(tab);
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playPop();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#17264A] border-b border-[#233866] shadow-md px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Cartoon Logo */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-1.5 focus:outline-none group text-left transition-transform active:scale-95"
          aria-label="Bunk Planner AI Home"
        >
          <div className="flex items-baseline">
            <span className="font-['Baloo_2'] text-xl sm:text-2xl font-extrabold tracking-tight text-[#FFD43B] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              Bunk
            </span>
            <span className="font-['Baloo_2'] text-xl sm:text-2xl font-extrabold tracking-tight text-white ml-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              Planner
            </span>
            <span className="font-['Baloo_2'] text-lg sm:text-xl font-extrabold text-[#65C7F2] ml-1">
              AI
            </span>
          </div>
          {/* Yellow paper plane icon */}
          <span className="text-[#FFD43B] text-lg sm:text-xl transform -rotate-12 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
            ✈️
          </span>
        </button>

        {/* Desktop Navigation Tabs matching mockup */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'dashboard');
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleTabClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#FFD43B] text-[#17264A] shadow-[0_3px_0_#d9b024] font-bold'
                    : 'text-white hover:text-[#FFD43B] hover:bg-[#203460]'
                }`}
              >
                {item.label}
              </motion.button>
            );
          })}

          {/* More Views Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold text-white/90 hover:text-white hover:bg-[#203460] flex items-center gap-1"
            >
              More <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-[#1a2c54] border border-[#2d467c] rounded-2xl shadow-2xl p-2 z-50 text-white animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setMenuOpen(false)}
              >
                <div className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  All 12 Modules
                </div>
                {secondaryNavItems.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleTabClick(sub.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      activeTab === sub.id
                        ? 'bg-[#FFD43B] text-[#17264A] font-bold'
                        : 'text-slate-200 hover:bg-[#284178]'
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: AI Assistant, Sound Toggle, Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bunty Advice cartoon button */}
          <button
            onClick={onOpenAIAssistant}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#FF963C] to-[#FFD43B] text-[#17264A] text-xs font-black px-3.5 py-1.5 rounded-full shadow-[0_2px_0_#cc742a] hover:brightness-105 active:scale-95 transition-all font-['Baloo_2']"
            title="Ask Bunty for instant college bunk advice"
          >
            <span>Ask Bunty 🧢</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute cartoon sound effects' : 'Enable cartoon sound effects'}
            className="p-1.5 rounded-full bg-[#203460] hover:bg-[#284178] text-white/90 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FFD43B]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1 bg-[#203460] hover:bg-[#284178] p-1 pr-2 rounded-full border border-[#2d467c] transition-all active:scale-95"
              aria-label="User profile menu"
            >
              <div className="w-7 h-7 aspect-square rounded-full overflow-hidden bg-sky-200 border border-[#FFD43B] flex items-center justify-center shrink-0">
                <img
                  src="/assets/characters/bunty_avatar.png"
                  alt="Bunty Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to cute letter avatar if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1a2c54] border border-[#2d467c] rounded-2xl shadow-2xl p-2 z-50 text-white animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#2d467c]/60 flex items-center gap-2.5">
                  <div className="w-9 h-9 aspect-square rounded-full overflow-hidden bg-sky-300 border-2 border-[#FFD43B] shrink-0">
                    <img src="/assets/characters/bunty_avatar.png" alt="Bunty" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#FFD43B]">{profile.name}</div>
                    <div className="text-[11px] text-slate-300">{profile.role}</div>
                  </div>
                </div>

                <div className="p-1 space-y-1 mt-1 text-xs">
                  <button
                    onClick={() => handleTabClick('profile')}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:bg-[#284178] flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => handleTabClick('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:bg-[#284178] flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleTabClick('achievements')}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:bg-[#284178] flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>Achievements (4 Badges)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden items-center justify-between gap-1 mt-2 overflow-x-auto no-scrollbar py-1">
        {mainNavItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'dashboard');
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive ? 'bg-[#FFD43B] text-[#17264A] font-bold' : 'text-slate-200 hover:bg-[#203460]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => handleTabClick('radar')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            activeTab === 'radar' ? 'bg-[#FFD43B] text-[#17264A] font-bold' : 'text-slate-200 hover:bg-[#203460]'
          }`}
        >
          Radar
        </button>
        <button
          onClick={() => handleTabClick('calendar')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            activeTab === 'calendar' ? 'bg-[#FFD43B] text-[#17264A] font-bold' : 'text-slate-200 hover:bg-[#203460]'
          }`}
        >
          Calendar
        </button>
      </div>
    </header>
  );
};
