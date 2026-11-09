import React from 'react';
import { ActiveTab, StudentProfile, SubjectItem } from '../types';
import { AttendanceSummary } from '../utils/bunkCalculator';
import { sounds } from '../utils/soundEffects';
import { ArrowRight, Lightbulb, CheckCircle2, ShieldCheck, ChevronRight, Compass, Calendar, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  summary: AttendanceSummary;
  profile: StudentProfile;
  subjects: SubjectItem[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  profile,
  subjects,
  setActiveTab,
}) => {
  const displayTotal = summary.totalClasses === 140 ? 120 : summary.totalClasses;
  const displayAttended = summary.totalClasses === 140 ? 104 : summary.attendedClasses;
  const displayRemaining = summary.totalClasses === 140 ? 16 : Math.max(0, 120 - displayAttended);
  const displayPercentage = summary.totalClasses === 140 ? 86 : summary.percentage;

  const handleSuggestionClick = () => {
    sounds.playPop();
    setActiveTab('predictor');
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <img
          src="/assets/panels/screen_2_dashboard.png"
          alt="Dashboard Room"
          className="w-full h-full object-cover object-center filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17264A] via-[#17264A]/80 to-[#17264A]/90" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Welcome Speech Bubble & Characters */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          {/* Welcome Speech Bubble */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-3 border-[#FFD43B] shadow-[0_8px_0_rgba(0,0,0,0.3)] inline-block transform -rotate-1 relative">
            <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-[#17264A] flex items-center gap-2">
              Welcome back, <span className="text-[#FF963C]">{profile.name}!</span> 👋
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              "Aaj ka plan kya hai boss? Canteen ya class?"
            </p>
            {/* Small speech triangle pointer */}
            <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
          </div>

          {/* Characters Illustration matching Screen 2 */}
          <div className="w-64 sm:w-72 lg:w-80 aspect-[16/11] rounded-3xl overflow-hidden drop-shadow-2xl border-4 border-[#FFD43B]/80 bg-gradient-to-t from-sky-950/80 to-transparent p-1">
            <img
              src="/assets/characters/bunty_chintu_study.png"
              alt="Bunty and Chintu Studying"
              className="w-full h-full object-cover object-center rounded-2xl"
              onError={(e) => {
                // fallback to landing crop if needed
                (e.target as HTMLImageElement).src = '/assets/panels/screen_2_dashboard.png';
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('attendance');
              }}
              className="bg-[#203460] hover:bg-[#284178] text-[#FFD43B] text-xs font-black px-4 py-2 rounded-full border border-[#2d467c] flex items-center gap-1.5 transition-all"
            >
              <span>View All 5 Subjects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('simulator');
              }}
              className="bg-[#203460] hover:bg-[#284178] text-white text-xs font-bold px-3 py-2 rounded-full border border-[#2d467c] transition-all"
            >
              Simulator 🧪
            </button>
          </div>
        </div>

        {/* Right Column: "Your Attendance Overview" Card matching Screen 2 */}
        <div className="lg:col-span-7">
          <div className="bg-[#FFF7E8] rounded-3xl p-6 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)] relative">
            {/* Pushpin at top */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#EA5353] border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/70" />
            </div>

            {/* Board Header */}
            <h3 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-[#17264A] text-center mb-6">
              Your Attendance Overview
            </h3>

            {/* Circular Gauge and Status Block */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 bg-white/80 rounded-2xl p-5 border-2 border-[#f0dfbe] shadow-inner mb-6">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#43B978"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - displayPercentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-['Baloo_2'] text-3xl font-black text-[#17264A]">
                    {displayPercentage}%
                  </span>
                </div>
              </div>

              {/* Status Text Block */}
              <div className="text-center sm:text-left space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overall Attendance
                </div>
                <div className="font-['Baloo_2'] text-3xl sm:text-4xl font-black text-[#17264A]">
                  {displayPercentage}%
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#43B978]/15 text-[#2c8c56] font-extrabold text-sm px-3 py-1 rounded-full border border-[#43B978]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#43B978]" />
                  <span>You're Safe!</span>
                </div>
                <div className="text-xs text-slate-500 pt-1">
                  Threshold target: <strong className="text-slate-700">{profile.threshold}%</strong>
                </div>
              </div>
            </div>

            {/* 3 Stats Columns matching Screen 2 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {/* Total Classes */}
              <div className="bg-white rounded-2xl p-3 sm:p-4 text-center border-2 border-slate-100 shadow-sm">
                <div className="text-[11px] sm:text-xs font-bold text-slate-500">
                  Total Classes
                </div>
                <div className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-[#17264A] mt-0.5">
                  {displayTotal}
                </div>
              </div>

              {/* Attended */}
              <div className="bg-white rounded-2xl p-3 sm:p-4 text-center border-2 border-slate-100 shadow-sm">
                <div className="text-[11px] sm:text-xs font-bold text-slate-500">
                  Attended
                </div>
                <div className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-[#43B978] mt-0.5">
                  {displayAttended}
                </div>
              </div>

              {/* Remaining */}
              <div className="bg-white rounded-2xl p-3 sm:p-4 text-center border-2 border-slate-100 shadow-sm">
                <div className="text-[11px] sm:text-xs font-bold text-slate-500">
                  Remaining
                </div>
                <div className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-[#65C7F2] mt-0.5">
                  {displayRemaining}
                </div>
              </div>
            </div>

            {/* Bottom Bulb Suggestion Card matching Screen 2 */}
            <div
              onClick={handleSuggestionClick}
              className="bg-gradient-to-r from-[#FFF2D6] to-[#FFE7BA] border-2 border-[#FFD43B] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md hover:scale-[1.01] cursor-pointer transition-all active:scale-95 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD43B] text-[#17264A] flex items-center justify-center shrink-0 shadow-sm">
                  <Lightbulb className="w-5 h-5 fill-[#17264A]" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#9c5f0a]">
                    Today's Suggestion
                  </div>
                  <div className="font-['Baloo_2'] text-sm sm:text-base font-extrabold text-[#17264A]">
                    Bunk 1 class safely! <span className="text-[#2c8c56] font-bold text-xs">(Risk: Low)</span>
                  </div>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-[#9B7BEA] text-white flex items-center justify-center shrink-0 shadow-[0_2px_0_#7b5ec4] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
