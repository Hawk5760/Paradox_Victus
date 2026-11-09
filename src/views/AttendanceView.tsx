import React, { useState } from 'react';
import { ActiveTab, SubjectItem } from '../types';
import { sounds } from '../utils/soundEffects';
import { Check, AlertTriangle, X, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { comicCardTap, comicButtonBounce } from '../utils/comicAnimations';

interface AttendanceViewProps {
  subjects: SubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectItem[]>>;
  threshold: number;
  setActiveTab: (tab: ActiveTab) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  subjects,
  setSubjects,
  threshold,
  setActiveTab,
}) => {
  const handleMarkAttendance = (id: string, deltaAttended: number, deltaTotal: number) => {
    if (deltaAttended === 0) {
      sounds.playWahWah();
    } else {
      sounds.playStamp();
    }

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== id) return sub;
        const newTotal = Math.max(1, sub.total + deltaTotal);
        const newAttended = Math.min(newTotal, Math.max(0, sub.attended + deltaAttended));
        return {
          ...sub,
          total: newTotal,
          attended: newAttended,
        };
      })
    );
  };

  const resetToDefault = () => {
    sounds.playBoing();
    setSubjects([
      { id: 'maths', name: 'Mathematics', code: 'MATH201', attended: 22, total: 28, room: 'A-102', professor: "Mehta Ma'am" },
      { id: 'eee', name: 'EEE', code: 'EEE202', attended: 21, total: 28, room: 'B-204', professor: 'Dubey Sir' },
      { id: 'phy', name: 'Physics', code: 'PHY203', attended: 24, total: 28, room: 'Lab P-2', professor: 'Kulkarni Sir' },
      { id: 'prog', name: 'Programming', code: 'CS204', attended: 26, total: 28, room: 'Lab L1', professor: 'Sharma Sir' },
      { id: 'eng', name: 'English', code: 'ENG205', attended: 20, total: 28, room: 'A-106', professor: 'Rao Sir' },
    ]);
  };

  const getStatusBadge = (pct: number) => {
    if (pct >= 90) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-300 font-bold text-xs bg-emerald-950/70 border border-emerald-500/50 px-2.5 py-0.5 rounded-full">
          <Check className="w-3.5 h-3.5 text-emerald-400" /> Great
        </span>
      );
    }
    if (pct >= threshold + 3) {
      return (
        <span className="inline-flex items-center gap-1 text-[#43B978] font-bold text-xs bg-[#43B978]/20 border border-[#43B978]/50 px-2.5 py-0.5 rounded-full">
          <Check className="w-3.5 h-3.5 text-[#43B978]" /> Safe
        </span>
      );
    }
    if (pct >= threshold) {
      return (
        <span className="inline-flex items-center gap-1 text-[#FF963C] font-bold text-xs bg-[#FF963C]/20 border border-[#FF963C]/50 px-2.5 py-0.5 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FF963C]" /> Borderline
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[#EA5353] font-bold text-xs bg-[#EA5353]/25 border border-[#EA5353]/60 px-2.5 py-0.5 rounded-full animate-pulse">
        <X className="w-3.5 h-3.5 text-[#EA5353]" /> At Risk
      </span>
    );
  };

  const getBarColor = (pct: number) => {
    if (pct >= threshold + 3) return 'bg-[#43B978]';
    if (pct >= threshold) return 'bg-[#FF963C]';
    return 'bg-[#EA5353]';
  };

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden pb-20 md:pb-6">
      {/* Background Chalkboard ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <img
          src="/assets/panels/screen_3_attendance.png"
          alt="Classroom blackboard"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Column: Chintu pointing chalk at blackboard */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center">
          <div className="relative group hover:scale-105 transition-transform duration-200">
            <div className="w-56 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-2xl border-4 border-[#FFD43B] bg-gradient-to-t from-sky-950/80 to-transparent">
              <img
                src="/assets/characters/chintu_chalk.png"
                alt="Chintu with Chalk"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Comic speech callout */}
            <div className="bg-[#FFD43B] text-[#17264A] font-['Baloo_2'] text-xs font-black px-3 py-1.5 rounded-2xl shadow-lg border border-white mt-3 text-center">
              "English me 71% hai! Sirf 1 class aur bunk ki toh warning letter aayega!" 😱
            </div>
          </div>
        </div>

        {/* Center/Right: Classroom Blackboard Table */}
        <div className="lg:col-span-9 w-full">
          {/* Wooden Border Blackboard Frame */}
          <div className="bg-[#1e2f27] border-[8px] sm:border-[14px] border-[#8B5A2B] rounded-3xl shadow-[0_12px_0_#5c3a1b,0_20px_25px_rgba(0,0,0,0.6)] p-3 sm:p-6 relative text-white">
            {/* Wooden Chalk Shelf Details at bottom of blackboard */}
            <div className="absolute -bottom-3 right-6 hidden sm:flex gap-2">
              <div className="w-10 h-3 bg-white/90 rounded-xs shadow-inner transform rotate-3" title="White Chalk" />
              <div className="w-8 h-3 bg-[#FFD43B] rounded-xs shadow-inner transform -rotate-2" title="Yellow Chalk" />
              <div className="w-14 h-4 bg-[#6d4c41] rounded-xs shadow-md" title="Duster" />
            </div>

            {/* Blackboard Header */}
            <div className="text-center border-b border-white/20 pb-3 mb-3 sm:mb-4 relative">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl text-[#FFD43B]">ele</span>
                <h2 className="font-['Baloo_2'] text-2xl sm:text-4xl font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  My Attendance
                </h2>
                <span className="text-lg sm:text-xl text-[#FFD43B]">yt</span>
              </div>
              <p className="text-xs sm:text-sm font-['Caveat',cursive] text-emerald-200 tracking-wider">
                Subject-wise attendance record • Tap buttons to mark
              </p>

              {/* Reset button top right */}
              <button
                type="button"
                onClick={resetToDefault}
                className="absolute right-0 top-0 text-[10px] sm:text-[11px] font-bold text-emerald-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 sm:px-2.5 py-1 rounded-full border border-white/20 transition-all active:scale-90"
                title="Reset to default mockup data"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Mobile Cards View (sm:hidden) */}
            <div className="block sm:hidden space-y-2.5 font-sans">
              {subjects.map((sub) => {
                const pct = sub.total > 0 ? Math.floor((sub.attended / sub.total) * 100) : 0;
                return (
                  <div
                    key={sub.id}
                    className="bg-white/5 border border-white/15 rounded-2xl p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-['Baloo_2'] font-black text-base text-white leading-tight">
                          {sub.name}
                        </div>
                        <div className="text-[10px] text-emerald-300/80 font-mono">
                          {sub.room} • {sub.professor}
                        </div>
                      </div>
                      <div>{getStatusBadge(pct)}</div>
                    </div>

                    {/* Progress Bar + Percentage */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct)}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="font-['Baloo_2'] font-black text-sm text-white w-9 text-right">
                        {pct}%
                      </span>
                    </div>

                    {/* Quick Interactive Mark Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                      <span className="font-mono font-bold text-slate-300 text-[11px]">
                        {sub.attended} / {sub.total} classes
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMarkAttendance(sub.id, 1, 1)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-lg font-black transition-transform active:scale-90 shadow-xs"
                        >
                          + Attended
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkAttendance(sub.id, 0, 1)}
                          className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] px-2 py-1 rounded-lg font-black transition-transform active:scale-90 shadow-xs"
                        >
                          + Bunked
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop / Tablet Attendance Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-xs sm:text-sm font-['Baloo_2'] text-amber-200">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center">Attended / Total</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-sans">
                  {subjects.map((sub) => {
                    const pct = sub.total > 0 ? Math.floor((sub.attended / sub.total) * 100) : 0;
                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-sm sm:text-base text-white font-['Nunito']">
                            {sub.name}
                          </div>
                          <div className="text-[11px] text-emerald-300/80 font-mono">
                            {sub.room} • {sub.professor}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="font-bold text-sm sm:text-base text-slate-100 font-mono">
                            {sub.attended} / {sub.total}
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(sub.id, 1, 1)}
                              className="bg-emerald-600/70 hover:bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold transition-transform active:scale-90"
                              title="Mark Attended (+1)"
                            >
                              +Attended
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(sub.id, 0, 1)}
                              className="bg-rose-600/70 hover:bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold transition-transform active:scale-90"
                              title="Mark Bunked (+0/1)"
                            >
                              +Bunked
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-3 min-w-[140px] sm:min-w-[180px]">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-white/20 rounded-full h-3 sm:h-3.5 overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct)}`}
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                            <span className="font-['Baloo_2'] font-black text-sm sm:text-base text-white w-10 text-right">
                              {pct}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          {getStatusBadge(pct)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Chalkboard Footer Note */}
            <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200/90 font-['Caveat',cursive] text-sm sm:text-base">
              <span>* Target: Minimum {threshold}% required for VTU Exams.</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playBoing();
                  setActiveTab('predictor');
                }}
                className="bg-[#FFD43B] text-[#17264A] font-['Baloo_2'] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md hover:bg-yellow-300 transition-colors flex items-center gap-1 active:scale-95"
              >
                <span>Plan Bunk with AI</span> ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
