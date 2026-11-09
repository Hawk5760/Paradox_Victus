import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { dubeyRageVariants, comicButtonBounce, comicCardTap } from '../utils/comicAnimations';
import { FlaskConical, Play, CheckCircle2, AlertTriangle, ChevronDown, Plus, Minus, ArrowRight, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface WhatIfSimulatorViewProps {
  totalClasses?: number;
  attendedClasses?: number;
  threshold?: number;
  setActiveTab: (tab: ActiveTab) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  totalClasses = 120,
  attendedClasses = 104,
  threshold = 75,
  setActiveTab,
}) => {
  // Bunk count state (defaults to 2 matching the mockup)
  const [bunkCount, setBunkCount] = useState<number>(2);
  const [simulatedCount, setSimulatedCount] = useState<number>(2);
  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Baseline attendance: 86% (matching mockup screen 6: Current Attendance: 86%)
  // When bunkCount is 2, projected is 80%!
  // Formula: current 86% - (bunkCount * 3)%:
  const currentPercentage = 86;
  const projectedPercentage = Math.max(0, currentPercentage - simulatedCount * 3);
  const isSafe = projectedPercentage >= threshold;

  const getRiskLevel = (pct: number) => {
    if (pct >= 80) return { label: 'Low', color: 'text-emerald-700 bg-emerald-100 border-emerald-300', dot: 'bg-emerald-500' };
    if (pct >= threshold) return { label: 'Medium', color: 'text-amber-700 bg-amber-100 border-amber-300', dot: 'bg-amber-500' };
    if (pct >= threshold - 5) return { label: 'High', color: 'text-orange-700 bg-orange-100 border-orange-300', dot: 'bg-orange-500' };
    return { label: 'Critical', color: 'text-rose-700 bg-rose-100 border-rose-300', dot: 'bg-rose-600' };
  };

  const risk = getRiskLevel(projectedPercentage);

  const handleSimulateClick = (countToSimulate?: number) => {
    const count = countToSimulate ?? bunkCount;
    sounds.playBoing();
    setIsAnimating(true);
    setSimulatedCount(count);
    setIsSimulated(true);

    setTimeout(() => {
      setIsAnimating(false);
      if (count <= 2) {
        sounds.playSuccess();
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else if (count === 3) {
        sounds.playAlert();
      } else {
        sounds.playDubeyRage();
      }
    }, 250);
  };

  const getChintuDialogue = (count: number) => {
    if (count <= 2) {
      return "Samosa party time! 2 classes bunk karke bhi 80% safe hai! 🍟😎";
    }
    if (count === 3) {
      return "Arre Bunty bhai! 3 classes pe 77% ho jayega, Dubey Sir ko shaq ho sakta hai! 😬";
    }
    return "BAAP RE! 4+ classes pe seedha Red Alert 71%! Dubey Sir mummy ko phone laga denge! 😱😭";
  };

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden pb-20 md:pb-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <img
          src="/assets/panels/screen_6_simulator.png"
          alt="Science lab simulator"
          className="w-full h-full object-cover filter blur-md"
        />
        <div className="absolute inset-0 bg-[#17264A]/80 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
        {/* Left Column: Chintu in Lab Coat Thinking matching Screen 6 */}
        <div className="hidden lg:flex lg:col-span-4 flex-col items-center justify-center">
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.04, rotate: 1 }}
            whileTap={{ scale: 0.96 }}
          >
            <div className="w-56 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-2xl border-4 border-[#FFD43B] bg-gradient-to-t from-sky-950/80 to-transparent">
              <img
                src="/assets/characters/chintu_confused.png"
                alt="Chintu in Lab Coat Thinking"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Comic speech bubble */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={simulatedCount}
              className="bg-[#FFF7E8] text-[#17264A] font-['Baloo_2'] text-xs font-black p-3 rounded-2xl shadow-xl border-2 border-[#FFD43B] mt-3 text-center"
            >
              "{getChintuDialogue(simulatedCount)}"
            </motion.div>
          </motion.div>
        </div>

        {/* Center/Right: Central Simulator Board matching Screen 6 */}
        <div className="lg:col-span-8 w-full">
          <motion.div
            variants={dubeyRageVariants}
            animate={!isSafe ? 'raging' : 'calm'}
            className={`bg-[#FFF7E8] rounded-3xl p-4 sm:p-7 border-4 shadow-[0_10px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)] transition-colors duration-300 ${
              !isSafe ? 'border-rose-500 shadow-[0_10px_0_#b91c1c,0_20px_25px_rgba(225,29,72,0.4)] ring-4 ring-rose-400/50' : 'border-[#FFD43B]'
            }`}
          >
            {/* Top Purple Banner with Flask matching Screen 6 */}
            <div className={`rounded-2xl p-3 sm:p-4 text-center text-white mb-4 sm:mb-5 shadow-md border-2 relative overflow-hidden transition-colors duration-300 ${
              !isSafe ? 'bg-gradient-to-r from-red-700 via-rose-800 to-red-900 border-red-500' : 'bg-[#593d8e] border-[#452d72]'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                  {!isSafe ? (
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-bounce" />
                  ) : (
                    <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD43B]" />
                  )}
                </div>
                <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {!isSafe ? '🚨 DUBEY SIR RAGE SIMULATOR 🚨' : 'What-if Simulator'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-purple-100 mt-0.5">
                {!isSafe
                  ? 'THRESHOLD BREACHED! DUBEY SIR REGISTER WITH RED PEN IS OPEN!'
                  : 'See how your attendance changes if you bunk upcoming classes.'}
              </p>
            </div>

            {/* Mobile Comic Chintu Alert Banner (lg:hidden) */}
            <div className={`flex lg:hidden items-center gap-2.5 border-2 rounded-2xl p-2.5 mb-4 text-[#17264A] transition-colors ${
              !isSafe ? 'bg-rose-100 border-rose-300' : 'bg-amber-100 border-amber-300'
            }`}>
              <div className="w-9 h-9 aspect-square rounded-full overflow-hidden bg-white border border-[#FFD43B] shrink-0">
                <img src="/assets/characters/chintu_chalk.png" alt="Chintu" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs font-['Baloo_2'] font-black leading-tight">
                {getChintuDialogue(simulatedCount)}
              </div>
            </div>

            {/* Quick Preset Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
              <span className="text-[11px] font-black uppercase text-slate-500 font-['Baloo_2'] mr-1">
                Quick Test:
              </span>
              {[
                { count: 1, label: '1 Bunk (Safe)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' },
                { count: 2, label: '2 Bunks (80% Safe)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' },
                { count: 3, label: '3 Bunks (77% Warning)', color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' },
                { count: 4, label: '4 Bunks (🔥 Dubey Rage)', color: 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200' },
                { count: 5, label: '5 Bunks (💥 71% Crisis)', color: 'bg-rose-200 text-rose-900 border-rose-400 hover:bg-rose-300' },
              ].map((preset) => (
                <motion.button
                  key={preset.count}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setBunkCount(preset.count);
                    handleSimulateClick(preset.count);
                  }}
                  className={`text-[11px] sm:text-xs font-['Baloo_2'] font-black px-2.5 py-1 rounded-xl border transition-all ${preset.color} ${
                    bunkCount === preset.count ? 'ring-2 ring-[#17264A] shadow-xs' : ''
                  }`}
                >
                  {preset.label}
                </motion.button>
              ))}
            </div>

            {/* Two Side-by-Side Cards matching Screen 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 mb-4 sm:mb-5">
              {/* Left Box: "If I bunk next... [ 2 ▼ ] classes" + Simulate Button */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#edd8b6] shadow-xs flex flex-col justify-between">
                <div>
                  <label className="font-['Baloo_2'] text-base sm:text-xl font-black text-[#17264A] block mb-3 sm:mb-4">
                    If I bunk next...
                  </label>

                  {/* Inline Stepper matching Screen 6: [ 2 ▼ ] classes */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center bg-[#f8fafc] border-2 border-slate-300 hover:border-[#8b5cf6] rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 shadow-inner">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          sounds.playSqueak();
                          setBunkCount((prev) => Math.max(1, prev - 1));
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-black text-sm active:scale-90 transition-transform"
                        title="Decrease bunk count"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </motion.button>

                      <div className="relative mx-1 sm:mx-2">
                        <select
                          value={bunkCount}
                          onChange={(e) => {
                            sounds.playPop();
                            setBunkCount(parseInt(e.target.value));
                          }}
                          className="font-['Baloo_2'] text-xl sm:text-2xl font-black text-[#17264A] bg-transparent focus:outline-none cursor-pointer appearance-none text-center pr-5"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-slate-700">
                          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          sounds.playBoing();
                          setBunkCount((prev) => Math.min(10, prev + 1));
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-black text-sm active:scale-90 transition-transform"
                        title="Increase bunk count"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    <span className="font-['Baloo_2'] text-base sm:text-xl font-black text-[#17264A]">
                      classes
                    </span>
                  </div>
                </div>

                {/* Big Golden Yellow Simulate Button matching Screen 6 */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.94, y: 2 }}
                  onClick={() => handleSimulateClick()}
                  className="w-full bg-[#FFD43B] hover:bg-[#ffe066] text-[#17264A] font-['Baloo_2'] text-base sm:text-xl font-black py-2.5 sm:py-3 rounded-2xl shadow-[0_5px_0_#d9b024] active:translate-y-1 active:shadow-none hover:shadow-[0_3px_0_#d9b024] transition-all flex items-center justify-center gap-2 border-2 border-[#17264A]"
                >
                  <span>Simulate</span>
                  <Play className="w-4 h-4 fill-current" />
                </motion.button>
              </div>

              {/* Right Box: "Simulation Result" matching Screen 6 */}
              <motion.div
                variants={dubeyRageVariants}
                animate={!isSafe ? 'raging' : 'calm'}
                className={`bg-white rounded-2xl p-4 sm:p-5 border-2 shadow-xs flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  !isSafe
                    ? 'border-rose-500 bg-rose-50/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : isAnimating
                    ? 'scale-105 border-[#8b5cf6] ring-4 ring-purple-200'
                    : 'border-[#edd8b6]'
                }`}
              >
                {/* Dubey Anger Marks 💢 when threshold is crossed */}
                {!isSafe && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-10 pointer-events-none">
                    <span className="text-xl sm:text-2xl animate-pulse">💢</span>
                    <span className="text-lg sm:text-xl animate-bounce">🔥</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-['Baloo_2'] text-base sm:text-lg font-black text-[#17264A]">
                      Simulation Result
                    </h3>
                    {!isSafe && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                        DUBEY RAGE ACTIVATED
                      </span>
                    )}
                  </div>

                  {/* Row 1: Current Attendance */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between font-['Baloo_2'] text-xs sm:text-base font-bold text-[#17264A] mb-1">
                      <span>Current Attendance</span>
                      <span className="font-black text-sm sm:text-lg">{currentPercentage}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-3 sm:h-3.5 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="bg-[#43B978] h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${currentPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Row 2: After Bunking */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between font-['Baloo_2'] text-xs sm:text-base font-bold text-[#17264A] mb-1">
                      <span>After Bunking ({simulatedCount} cl)</span>
                      <motion.span
                        key={projectedPercentage}
                        initial={{ scale: 1.3, color: '#e11d48' }}
                        animate={{ scale: 1 }}
                        className={`font-black text-sm sm:text-lg ${
                          projectedPercentage >= threshold ? 'text-[#17264A]' : 'text-rose-600'
                        }`}
                      >
                        {projectedPercentage}%
                      </motion.span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-3 sm:h-3.5 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          projectedPercentage >= threshold ? 'bg-[#43B978]' : 'bg-[#EA5353]'
                        }`}
                        style={{ width: `${projectedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Risk Level matching Screen 6 */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-['Baloo_2'] text-xs sm:text-base font-bold text-slate-600">
                    Risk Level
                  </span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-['Baloo_2'] font-black border ${risk.color}`}
                  >
                    <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${risk.dot} animate-pulse`} />
                    <span>{risk.label}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Special Dubey Rage Comic Banner when Threshold is crossed */}
            <AnimatePresence>
              {!isSafe && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  className="mb-4 bg-gradient-to-r from-rose-600 to-red-800 text-white rounded-2xl p-3 sm:p-4 border-2 border-red-400 shadow-lg flex items-center gap-3 sm:gap-4"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 aspect-square rounded-full overflow-hidden bg-white border-2 border-amber-300 shrink-0 shadow-md">
                    <img
                      src="/assets/characters/dubey_avatar.png"
                      alt="Dubey Sir Enraged"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-['Baloo_2'] text-sm sm:text-base font-black text-amber-300">
                        💢 DUBEY SIR: "BUNTY! CHINTU! DETENTION!"
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-rose-100">
                      "Attendance 75% ke neeche gayi toh register mein seedha Red Mark lagega aur HOD office bulayenge!"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prominent Results Callout Banner */}
            <div
              className={`rounded-2xl p-3.5 sm:p-4 border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
                isSafe
                  ? 'bg-gradient-to-r from-[#dcfce7] to-[#bbf7d0] border-[#86efac] text-emerald-950'
                  : 'bg-gradient-to-r from-[#fee2e2] to-[#fecaca] border-[#fca5a5] text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isSafe ? 'bg-[#43B978] text-white' : 'bg-[#EA5353] text-white'
                  }`}
                >
                  {isSafe ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider opacity-75">
                    {isSafe ? 'Simulation Verdict: Safe Bunk' : 'Simulation Verdict: High Danger (Dubey Rage)'}
                  </div>
                  <div className="font-['Baloo_2'] text-xs sm:text-base font-black">
                    {isSafe
                      ? `You can safely bunk ${simulatedCount} class${simulatedCount > 1 ? 'es' : ''}! Attendance stays at ${projectedPercentage}% (Above ${threshold}%).`
                      : `Warning! Bunking ${simulatedCount} classes drops attendance to ${projectedPercentage}%, below your ${threshold}% target!`}
                  </div>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playBoing();
                  setActiveTab(isSafe ? 'predictor' : 'recovery');
                }}
                className={`w-full sm:w-auto text-center justify-center flex items-center gap-1 text-xs font-black px-3.5 py-2 rounded-xl transition-transform active:scale-95 shrink-0 ${
                  isSafe
                    ? 'bg-[#17264A] text-white hover:bg-[#203460]'
                    : 'bg-[#EA5353] text-white hover:bg-rose-700'
                }`}
              >
                <span>{isSafe ? 'Go to Predictor' : 'View Recovery Plan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
