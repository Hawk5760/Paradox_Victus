import React, { useState } from 'react';
import { ActiveTab, StudentProfile } from '../types';
import { AttendanceSummary } from '../utils/bunkCalculator';
import { sounds } from '../utils/soundEffects';
import { Sparkles, ArrowRight, ShieldCheck, Play, MessageCircle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { comicButtonBounce, comicCardTap, floatingIdleVariants } from '../utils/comicAnimations';

interface LandingHomeViewProps {
  summary: AttendanceSummary;
  profile: StudentProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAIAssistant: () => void;
}

export const LandingHomeView: React.FC<LandingHomeViewProps> = ({
  summary,
  profile,
  setActiveTab,
  onOpenAIAssistant,
}) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [characterTapped, setCharacterTapped] = useState<'bunty' | 'dubey' | 'chintu' | null>(null);

  const dialogues = [
    {
      bunty: 'Abe Chintu, Dubey Sir ke boring lecture ki aisi taisi, chal canteen!',
      chintu: 'Abe pagal hai kya?! EEE mein 75% pe latke hain, kachra ho jayega!',
      dubey: 'TUM DONO PHIR SE CANTEEN BHAAG RAHE HO?!',
    },
    {
      bunty: 'Row 4 ke peeche se sneaky proxy lagwa denge, scene set hai!',
      chintu: 'Dubey Sir do baar roll call lete hain, meri toh phat ke 64 ho gayi!',
      dubey: 'REGISTER MEIN SEEDHA RED PEN CHAL RAHA HAI!',
    },
    {
      bunty: 'Canteen ke garam samose ke liye 1 lecture chhodna birthright hai!',
      chintu: 'Agar unhone ghar pe phone kiya na toh pitaji joota nikaal lenge!',
      dubey: 'CLASS CHHOD KE SAMOSA THOONSOGE?! DETENTION!',
    },
  ];

  const currentDialogue = dialogues[dialogueIndex];

  const nextDialogue = () => {
    sounds.playPop();
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
  };

  const handleStartAnalysis = () => {
    sounds.playCollegeBell();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    setActiveTab('predictor');
  };

  const handleViewAttendance = () => {
    sounds.playPop();
    setActiveTab('attendance');
  };

  const triggerBuntyReaction = () => {
    sounds.playBoing();
    setCharacterTapped('bunty');
    setActiveSpeech("Bunty: 'Abe Dubey Sir ka dimaag kharab hai toh hum kyun sadhein? Bunk mode full ON hai boss! 🕶️🔥'");
    setTimeout(() => setCharacterTapped(null), 800);
  };

  const triggerDubeyReaction = () => {
    sounds.playDubeyRage();
    setCharacterTapped('dubey');
    setActiveSpeech("Dubey Sir: 'Khabardaar! 75% se 1% kam hua toh internal marks ZERO kar dunga! 📋💢'");
    setTimeout(() => setCharacterTapped(null), 800);
  };

  return (
    <div className="relative min-h-[calc(100vh-130px)] flex flex-col justify-between overflow-hidden bg-[#17264A] pb-20 md:pb-6">
      {/* Background Campus Scene */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <img
          src="/assets/panels/screen_1_landing.png"
          alt="College Campus Scene"
          className="w-full h-full object-cover object-center filter blur-lg scale-110"
        />
        <div className="absolute inset-0 bg-[#17264A]/80 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-6 w-full flex-1 flex flex-col justify-center">
        {/* Top Comic Speech Bubbles (Tap to Cycle Banter) */}
        <div
          onClick={nextDialogue}
          className="cursor-pointer max-w-2xl mx-auto mb-3 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border-2 border-[#FFD43B] shadow-[0_4px_0_#d9b024] flex flex-wrap items-center justify-between gap-2 hover:scale-[1.01] active:scale-95 transition-all"
          title="Click to hear next comic dialogue!"
        >
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black">
            <span className="text-[#FF963C] flex items-center gap-1 font-['Baloo_2'] text-xs sm:text-sm">
              <MessageCircle className="w-3.5 h-3.5" /> Bunty:
            </span>
            <span className="text-slate-800 italic">"{currentDialogue.bunty}"</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-3">
            <span className="text-[#65C7F2] font-['Baloo_2'] text-xs sm:text-sm">Chintu:</span>
            <span className="text-slate-700 italic">"{currentDialogue.chintu}"</span>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold ml-auto flex items-center gap-1">
            <span>Banter</span> 🔄
          </span>
        </div>

        {/* Temporary Character Speech Callout on Tap */}
        {activeSpeech && (
          <div className="max-w-md mx-auto mb-3 bg-[#FFD43B] text-[#17264A] p-2.5 rounded-2xl font-['Baloo_2'] text-xs sm:text-sm font-black text-center shadow-lg border-2 border-[#17264A] animate-in zoom-in-95 duration-200">
            {activeSpeech}
          </div>
        )}

        {/* Mobile Character Peeking Banner (md:hidden) for funny touch feedback */}
        <div className="flex md:hidden items-center justify-around gap-2 mb-3 px-2">
          {/* Mobile Bunty Card */}
          <button
            type="button"
            onClick={triggerBuntyReaction}
            className={`flex items-center gap-2 bg-[#203460] p-1.5 pr-3 rounded-2xl border-2 border-[#FFD43B] shadow-comic-sm transition-transform active:scale-90 ${
              characterTapped === 'bunty' ? 'animate-rubber-band' : ''
            }`}
          >
            <div className="w-10 h-10 aspect-square rounded-xl overflow-hidden bg-sky-300 border border-white shrink-0">
              <img src="/assets/characters/bunty_avatar.png" alt="Bunty" className="w-full h-full object-cover" />
            </div>
            <div className="text-left leading-tight">
              <div className="font-['Baloo_2'] text-xs font-black text-[#FFD43B]">Bunty 🧢</div>
              <div className="text-[10px] text-slate-300 font-bold">Tap to Bunk!</div>
            </div>
          </button>

          {/* Mobile Dubey Sir Card */}
          <button
            type="button"
            onClick={triggerDubeyReaction}
            className={`flex items-center gap-2 bg-[#203460] p-1.5 pr-3 rounded-2xl border-2 border-[#EA5353] shadow-comic-sm transition-transform active:scale-90 ${
              characterTapped === 'dubey' ? 'animate-dubey-rage' : ''
            }`}
          >
            <div className="w-10 h-10 aspect-square rounded-xl overflow-hidden bg-red-300 border border-white shrink-0">
              <img src="/assets/characters/dubeysir_angry.png" alt="Dubey Sir" className="w-full h-full object-cover" />
            </div>
            <div className="text-left leading-tight">
              <div className="font-['Baloo_2'] text-xs font-black text-[#EA5353]">Dubey Sir 📋</div>
              <div className="text-[10px] text-slate-300 font-bold">Tap to Rage!</div>
            </div>
          </button>
        </div>

        {/* Hero Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 sm:gap-6 my-auto">
          {/* Desktop Left Characters: Bunty & Chintu */}
          <div className="hidden md:flex md:col-span-3 flex-col items-center justify-end relative">
            <div
              onClick={triggerBuntyReaction}
              className={`relative group cursor-pointer transition-transform hover:scale-105 duration-200 ${
                characterTapped === 'bunty' ? 'animate-rubber-band' : ''
              }`}
            >
              <div className="w-48 lg:w-56 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-[0_12px_16px_rgba(0,0,0,0.5)] border-4 border-[#FFD43B]/80 bg-gradient-to-t from-sky-900/60 to-transparent">
                <img
                  src="/assets/characters/bunty_landing.png"
                  alt="Bunty & Chintu"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -top-3 -right-3 bg-[#FFD43B] text-[#17264A] font-['Baloo_2'] text-xs font-black px-2.5 py-1 rounded-full shadow-md transform rotate-6 border border-white">
                Bhai, plan ready hai! 😎
              </div>
            </div>
          </div>

          {/* Center 3D Board & CTAs */}
          <div className="md:col-span-6 flex flex-col items-center text-center">
            {/* 3D Billboard / Wooden Signboard Container */}
            <div className="w-full max-w-lg bg-[#FFF7E8] rounded-3xl p-5 sm:p-7 border-4 border-[#FFD43B] shadow-[0_10px_0_#d9b024,0_18px_25px_rgba(0,0,0,0.4)] relative">
              {/* College Tag Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#17264A] text-[#FFD43B] text-[11px] sm:text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#FFD43B]/40 shadow-xs">
                <span>🏫</span>
                <span>GIT COLLEGE CAMPUS</span>
              </div>

              {/* Title: Bunk Planner AI */}
              <div className="relative my-1">
                <h1 className="font-['Baloo_2'] text-3xl sm:text-5xl lg:text-6xl font-black text-[#17264A] leading-tight tracking-tight drop-shadow-xs flex items-center justify-center gap-1.5 sm:gap-2">
                  <span className="text-[#FF963C]">Bunk</span>
                  <span className="text-[#17264A]">Planner</span>
                  <span className="text-[#65C7F2]">AI</span>
                  <span className="text-2xl sm:text-4xl inline-block transform -rotate-12 animate-plane-float">
                    ✈️
                  </span>
                </h1>
              </div>

              {/* Tagline Banner */}
              <div className="inline-block my-2 bg-[#FFD43B] px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-2xl shadow-sm transform -rotate-1 border-2 border-[#17264A]">
                <p className="font-['Baloo_2'] text-base sm:text-2xl font-black text-[#17264A] leading-snug">
                  Bhai, Aaj College Jaayein Ya Nahi?
                </p>
                <div className="w-20 sm:w-28 h-1 bg-[#EA5353] mx-auto rounded-full mt-0.5" />
              </div>

              {/* Subtitle */}
              <p className="text-slate-700 text-xs sm:text-sm font-bold max-w-md mx-auto mt-1 px-2">
                Bunty & Chintu's hilarious attendance calculator & smart bunking guide!
              </p>

              {/* Primary Action Buttons */}
              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.94, y: 2 }}
                  onClick={handleStartAnalysis}
                  className="w-full sm:w-auto bg-[#FFD43B] hover:bg-[#ffe066] text-[#17264A] font-['Baloo_2'] text-base sm:text-xl font-black px-6 sm:px-8 py-3 rounded-2xl shadow-[0_5px_0_#d9b024] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-[#17264A]"
                >
                  <span>Start Bunk Analysis</span>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewAttendance}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#17264A] font-['Baloo_2'] text-xs sm:text-base font-bold px-4 sm:px-5 py-2.5 rounded-2xl border-2 border-slate-300 shadow-sm transition-all"
                >
                  View My Attendance
                </motion.button>
              </div>

              {/* Funny Stamp Badge */}
              <div className="mt-4 pt-3 border-t border-amber-200/70 flex items-center justify-center gap-2 text-[11px] font-black text-amber-900">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  ✓ 100% Dubey Proof
                </span>
                <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-300">
                  🍟 Samosa Safe
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Right Character: Dubey Sir */}
          <div className="hidden md:flex md:col-span-3 flex-col items-center justify-end relative">
            <div
              onClick={triggerDubeyReaction}
              className={`relative group cursor-pointer transition-transform hover:scale-105 duration-200 ${
                characterTapped === 'dubey' ? 'animate-dubey-rage' : ''
              }`}
            >
              <div className="w-48 lg:w-56 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-[0_12px_16px_rgba(0,0,0,0.5)] border-4 border-[#EA5353]/80 bg-gradient-to-t from-red-950/60 to-transparent">
                <img
                  src="/assets/characters/dubeysir_angry.png"
                  alt="Dubey Sir Angry"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -top-4 -left-2 text-2xl font-black text-[#EA5353] animate-bounce">
                💢
              </div>
              <div className="absolute -bottom-2 -left-2 bg-[#EA5353] text-white font-['Baloo_2'] text-xs font-black px-2.5 py-1 rounded-full shadow-md border border-white">
                "{currentDialogue.dubey}"
              </div>
            </div>
          </div>
        </div>

        {/* Today's Attendance Strip */}
        <div className="mt-4 sm:mt-6 bg-[#1a2c54]/95 backdrop-blur-md border-2 border-[#2d467c] rounded-2xl p-3 sm:p-4 text-white shadow-xl max-w-4xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#43B978] flex items-center justify-center font-['Baloo_2'] font-black text-xl text-white shadow-md border-2 border-white/20 shrink-0">
                {summary.percentage}%
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#FFD43B] font-black">
                  Today's Attendance Status
                </div>
                <div className="font-extrabold text-xs sm:text-base flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>You're Safe! ({summary.attendedClasses} / {summary.totalClasses} classes)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2d467c]">
              <div className="text-left sm:text-right">
                <div className="text-[10px] text-slate-300 font-bold">Suggestion for Today</div>
                <div className="text-xs font-['Baloo_2'] font-black text-[#FFD43B]">
                  Bunk 1 class safely! (Risk: Low)
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('dashboard');
                }}
                className="bg-[#284178] hover:bg-[#345396] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all active:scale-95 shrink-0"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
