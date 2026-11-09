import React, { useState } from 'react';
import { ActiveTab, SubjectItem } from '../types';
import { calculateSubjectBunk, Subject } from '../utils/bunkCalculator';
import { sounds } from '../utils/soundEffects';
import { Target, Lightbulb, RotateCcw, ShieldCheck, AlertTriangle, XCircle, Gauge, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { comicButtonBounce, comicCardTap } from '../utils/comicAnimations';

interface BunkPredictorViewProps {
  subjects: SubjectItem[];
  threshold: number;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BunkPredictorView: React.FC<BunkPredictorViewProps> = ({
  subjects,
  threshold,
  setActiveTab,
}) => {
  const [mode, setMode] = useState<'class' | 'day'>('class');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('eee');
  const [selectedDay, setSelectedDay] = useState<string>('Thu');
  const [bunkCount, setBunkCount] = useState<number>(1);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[1] || subjects[0];

  // Calculate prediction using our decoupled math utility
  const prediction = calculateSubjectBunk(
    {
      id: selectedSubject.id,
      name: selectedSubject.name,
      attended: selectedSubject.attended,
      total: selectedSubject.total,
    },
    bunkCount,
    threshold
  );

  const handleAnalyzeAgain = () => {
    sounds.playPop();
    // small bounce effect / re-evaluation
    if (prediction.canBunk) {
      sounds.playSuccess();
    } else {
      sounds.playAlert();
    }
  };

  const getSafetyBadge = (level: string) => {
    switch (level) {
      case 'High':
        return (
          <div className="flex items-center gap-1.5 text-[#2c8c56] font-['Baloo_2'] text-xl sm:text-2xl font-black">
            <Gauge className="w-6 h-6 text-[#43B978]" />
            <span>High</span>
          </div>
        );
      case 'Medium':
        return (
          <div className="flex items-center gap-1.5 text-[#d97706] font-['Baloo_2'] text-xl sm:text-2xl font-black">
            <Gauge className="w-6 h-6 text-[#FF963C]" />
            <span>Medium</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-[#dc2626] font-['Baloo_2'] text-xl sm:text-2xl font-black">
            <Gauge className="w-6 h-6 text-[#EA5353]" />
            <span>Low Risk</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="/assets/panels/screen_4_predictor.png"
          alt="Bunk Predictor Background"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Bunty clasped hands winking matching Screen 4 */}
        <div className="hidden lg:flex lg:col-span-4 flex-col items-center justify-center">
          <div className="relative group hover:scale-105 transition-transform duration-200">
            <div className="w-64 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-2xl border-4 border-[#FFD43B] bg-gradient-to-t from-sky-950/80 to-transparent">
              <img
                src="/assets/characters/bunty_clasped.png"
                alt="Bunty Planning Bunk"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/panels/screen_4_predictor.png';
                }}
              />
            </div>
            {/* Comic Speech Bubble */}
            <div className="bg-[#FFF7E8] text-[#17264A] font-['Baloo_2'] text-xs font-black p-2.5 rounded-2xl shadow-xl border-2 border-[#FFD43B] mt-3 text-center">
              "Calculator jhooth nahi bolta bhai! Safely bunk karo aur mast chill karo!" 😎
            </div>
          </div>
        </div>

        {/* Center/Right: Central Predictor Card matching Screen 4 */}
        <div className="lg:col-span-8">
          <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)] relative">
            {/* Header Banner with Dartboard Icon */}
            <div className="bg-[#c2593f] rounded-2xl p-3 sm:p-4 text-center text-white mb-6 shadow-md border-2 border-[#943c25] relative overflow-hidden">
              <div className="flex items-center justify-center gap-2">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD43B] animate-pulse" />
                <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-white tracking-wide">
                  Bunk Predictor
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-100 mt-0.5">
                Find the safest class or day to bunk without getting caught!
              </p>
            </div>

            {/* Mode Tabs: [Bunk a Class] [Bunk a Day] */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-2xl mb-6">
              <button
                onClick={() => {
                  sounds.playPop();
                  setMode('class');
                }}
                className={`py-2.5 rounded-xl font-['Baloo_2'] font-bold text-sm sm:text-base transition-all ${
                  mode === 'class'
                    ? 'bg-[#65C7F2] text-[#17264A] shadow-[0_2px_0_#3faedb]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bunk a Class
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setMode('day');
                }}
                className={`py-2.5 rounded-xl font-['Baloo_2'] font-bold text-sm sm:text-base transition-all ${
                  mode === 'day'
                    ? 'bg-[#65C7F2] text-[#17264A] shadow-[0_2px_0_#3faedb]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bunk a Day
              </button>
            </div>

            {mode === 'class' ? (
              /* Class selection dropdown */
              <div className="mb-6">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Select Subject
                </label>
                <div className="relative">
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => {
                      sounds.playPop();
                      setSelectedSubjectId(e.target.value);
                    }}
                    className="w-full bg-white border-2 border-slate-300 hover:border-[#65C7F2] rounded-2xl py-3 px-4 font-['Baloo_2'] text-base sm:text-lg font-black text-[#17264A] focus:outline-none focus:ring-2 focus:ring-[#65C7F2] shadow-sm appearance-none cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.attended}/{s.total} • {Math.floor((s.attended / s.total) * 100)}%)
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-700">
                    ▼
                  </div>
                </div>
              </div>
            ) : (
              /* Day selection dropdown */
              <div className="mb-6">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Select College Day
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        sounds.playPop();
                        setSelectedDay(d);
                      }}
                      className={`py-2 rounded-xl font-['Baloo_2'] font-bold text-xs sm:text-sm border-2 ${
                        selectedDay === d
                          ? 'bg-[#9B7BEA] text-white border-[#7b5ec4] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2 Metric Boxes: Bunk Safety & Projected Attendance matching Screen 4 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Box 1: Bunk Safety */}
              <div className="bg-white rounded-2xl p-4 text-center border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-slate-500 mb-1">
                  Bunk Safety
                </div>
                {getSafetyBadge(prediction.safetyLevel)}
              </div>

              {/* Box 2: Projected Attendance */}
              <div className="bg-white rounded-2xl p-4 text-center border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-slate-500 mb-1">
                  Projected Attendance
                </div>
                <div className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-[#17264A]">
                  {prediction.projectedPercentage}%
                </div>
              </div>
            </div>

            {/* Lightbulb Recommendation Card matching Screen 4 */}
            <div
              className={`rounded-2xl p-4 mb-6 border-2 flex items-start gap-3 shadow-sm ${
                prediction.canBunk
                  ? 'bg-[#FFF2D6] border-[#FFD43B] text-amber-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">
                <Lightbulb
                  className={`w-5 h-5 ${prediction.canBunk ? 'text-amber-500 fill-amber-500' : 'text-red-500'}`}
                />
              </div>
              <div>
                <p className="font-['Baloo_2'] text-sm sm:text-base font-extrabold leading-snug">
                  {prediction.canBunk
                    ? 'You can bunk this class! Your attendance will still stay above 75%.'
                    : `Warning! Bunking drops your attendance to ${prediction.projectedPercentage}%, below your ${threshold}% target.`}
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  {prediction.canBunk
                    ? 'Dubey Sir won’t be able to debar you. Enjoy canteen samosas!'
                    : 'Dubey Sir is keeping an eye on you! Better attend this one.'}
                </p>
              </div>
            </div>

            {/* Analyze Again Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.94, y: 2 }}
              onClick={handleAnalyzeAgain}
              className="w-full bg-[#FFD43B] hover:bg-[#ffe066] text-[#17264A] font-['Baloo_2'] text-base sm:text-lg font-black py-3 rounded-2xl shadow-[0_4px_0_#d9b024] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-[#17264A]"
            >
              <span>Analyze Again</span>
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
