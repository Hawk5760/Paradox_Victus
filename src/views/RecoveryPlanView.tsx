import React, { useState } from 'react';
import { ActiveTab, SubjectItem } from '../types';
import { calculateRecoveryPlan } from '../utils/bunkCalculator';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { HeartPulse, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Award } from 'lucide-react';

interface RecoveryPlanViewProps {
  subjects: SubjectItem[];
  threshold: number;
  setActiveTab: (tab: ActiveTab) => void;
}

export const RecoveryPlanView: React.FC<RecoveryPlanViewProps> = ({
  subjects,
  threshold,
  setActiveTab,
}) => {
  const [planStarted, setPlanStarted] = useState(false);

  // Recovery plan calculation based on mockup spec (English 20/28 = 71%)
  const englishSub = subjects.find((s) => s.id === 'eng') || subjects[4];
  const totalClasses = englishSub.total;
  const attendedClasses = englishSub.attended;
  const recoveryPlan = calculateRecoveryPlan(attendedClasses, totalClasses, subjects, threshold);

  const handleStartPlan = () => {
    sounds.playSuccess();
    setPlanStarted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="/assets/panels/screen_8_recovery.png"
          alt="Recovery Plan Background"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Bunty determined thumbs up matching Screen 8 */}
        <div className="hidden lg:flex lg:col-span-4 flex-col items-center justify-center">
          <div className="relative group hover:scale-105 transition-transform duration-200">
            <div className="w-64 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-2xl border-4 border-[#43B978] bg-gradient-to-t from-emerald-950/80 to-transparent">
              <img
                src="/assets/characters/bunty_determined.png"
                alt="Bunty Determined Thumbs Up"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/panels/screen_8_recovery.png';
                }}
              />
            </div>
            {/* Comic speech bubble */}
            <div className="bg-[#FFF7E8] text-[#17264A] font-['Baloo_2'] text-xs font-black p-3 rounded-2xl shadow-xl border-2 border-[#43B978] mt-3 text-center">
              "Abhi comeback hoga boss! Agle 6 classes no bunk, seedha 78% pe gaadi rukegi!" 🚀🔥
            </div>
          </div>
        </div>

        {/* Center/Right: Recovery Card matching Screen 8 */}
        <div className="lg:col-span-8">
          <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)]">
            {/* Header Banner matching Screen 8 with Heart/Cross */}
            <div className="bg-[#e11d48] rounded-2xl p-3 sm:p-4 text-center text-white mb-6 shadow-md border-2 border-[#be123c] flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <HeartPulse className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-white tracking-wide">
                  Attendance Recovery Plan
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-rose-100 mt-0.5">
                Fell below target? Here's your comeback plan!
              </p>
            </div>

            {/* Split Grid: Left Status Box, Right Checklist matching Screen 8 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
              {/* Left Box: "Your Status" 71% ⚠ Below 75% */}
              <div className="md:col-span-5 bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                  Your Status
                </div>
                <div className="font-['Baloo_2'] text-4xl sm:text-5xl font-black text-[#EA5353] my-1">
                  71%
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#EA5353] bg-rose-50 border border-rose-200 px-3 py-1 rounded-full mb-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Below 75%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#EA5353] h-full rounded-full transition-all duration-500"
                    style={{ width: '71%' }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  Subject: English (20/28)
                </div>
              </div>

              {/* Right Box: Comeback Checklist matching Screen 8 */}
              <div className="md:col-span-7 bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-3 font-['Baloo_2'] text-sm sm:text-base font-bold text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#43B978] shrink-0" />
                    <span>Attend next <strong className="text-[#17264A] font-black">6 classes</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#43B978] shrink-0" />
                    <span>Avoid bunking this week</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#43B978] shrink-0" />
                    <span>Focus on: <strong className="text-[#9c5f0a]">EEE, English</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#43B978] shrink-0" />
                    <span>Projected Attendance: <strong className="text-emerald-700 font-black">78%</strong></span>
                  </div>
                </div>

                {planStarted && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-emerald-800 text-center animate-in fade-in">
                    🎯 Recovery Plan Activated! Reminder set for upcoming classes.
                  </div>
                )}
              </div>
            </div>

            {/* Start Recovery Plan CTA Button matching Screen 8 */}
            <button
              onClick={handleStartPlan}
              className="w-full bg-[#43B978] hover:bg-[#3ba56b] text-white font-['Baloo_2'] text-base sm:text-lg font-black py-3 rounded-2xl shadow-[0_4px_0_#2b8252] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-[#1e5a38]"
            >
              <span>{planStarted ? 'Recovery Plan In Progress' : 'Start Recovery Plan'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
