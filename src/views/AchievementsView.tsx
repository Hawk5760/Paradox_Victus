import React from 'react';
import { ActiveTab, AchievementItem } from '../types';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Award, Trophy, Shield, Crown, Calendar, Sparkles } from 'lucide-react';

interface AchievementsViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ setActiveTab }) => {
  const achievements: AchievementItem[] = [
    {
      id: 'smart_bunker',
      title: 'Smart Bunker',
      subtitle: 'Plan 5 safe bunks',
      iconType: 'smart_bunker',
      unlocked: true,
      progress: 5,
      maxProgress: 5,
    },
    {
      id: 'attendance_hero',
      title: 'Attendance Hero',
      subtitle: 'Maintain 85%+',
      iconType: 'attendance_hero',
      unlocked: true,
      progress: 86,
      maxProgress: 85,
    },
    {
      id: 'recovery_king',
      title: 'Recovery King',
      subtitle: 'Bounce back from <75%',
      iconType: 'recovery_king',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'timetable_pro',
      title: 'Timetable Pro',
      subtitle: 'Use timetable for 7 Badges',
      iconType: 'timetable_pro',
      unlocked: false,
      progress: 4,
      maxProgress: 7,
    },
  ];

  const handleBadgeClick = (ach: AchievementItem) => {
    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'smart_bunker':
        return <Trophy className="w-8 h-8 text-[#FFD43B] drop-shadow-md" />;
      case 'attendance_hero':
        return <Shield className="w-8 h-8 text-[#FF963C] drop-shadow-md" />;
      case 'recovery_king':
        return <Crown className="w-8 h-8 text-[#FFD43B] drop-shadow-md" />;
      default:
        return <Calendar className="w-8 h-8 text-[#65C7F2] drop-shadow-md" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="/assets/panels/screen_11_achievements.png"
          alt="Achievements Background"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Bunty Peace Sign with sunglasses matching Screen 11 */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center">
          <div className="relative group hover:scale-105 transition-transform duration-200">
            <div className="w-56 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-2xl border-4 border-[#FFD43B] bg-gradient-to-t from-yellow-950/80 to-transparent">
              <img
                src="/assets/characters/bunty_peace.png"
                alt="Bunty Peace Sign"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/panels/screen_11_achievements.png';
                }}
              />
            </div>
            {/* Comic speech bubble */}
            <div className="bg-[#FFF7E8] text-[#17264A] font-['Baloo_2'] text-xs font-black p-2.5 rounded-2xl shadow-xl border-2 border-[#FFD43B] mt-3 text-center">
              "Smart bunker badges unlocked! Dubey Sir ko pata bhi nahi chala!" 🏆✌️
            </div>
          </div>
        </div>

        {/* Center/Right: Badges Grid matching Screen 11 */}
        <div className="lg:col-span-9">
          <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)]">
            {/* Header Banner matching Screen 11 with Trophy */}
            <div className="bg-[#1e2a44] rounded-2xl p-3 sm:p-4 text-center text-white mb-6 shadow-md border-2 border-[#2b3d63] flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFD43B]" />
                <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-white tracking-wide">
                  Achievements
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-yellow-200 mt-0.5">
                Unlock badges for being a smart (and responsible) student!
              </p>
            </div>

            {/* 4 Badges Row matching Screen 11 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  onClick={() => handleBadgeClick(ach)}
                  className={`rounded-2xl p-4 text-center border-2 transition-all cursor-pointer group flex flex-col items-center justify-between ${
                    ach.unlocked
                      ? 'bg-gradient-to-b from-[#FFFDF0] to-[#FFF3C4] border-[#FFD43B] shadow-[0_4px_0_#d9b024] hover:scale-105'
                      : 'bg-slate-100 border-slate-300 opacity-60'
                  }`}
                >
                  {/* Badge Icon circle */}
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-inner flex items-center justify-center mb-2 group-hover:rotate-6 transition-transform">
                    {getBadgeIcon(ach.iconType)}
                  </div>

                  <div>
                    <h4 className="font-['Baloo_2'] text-sm sm:text-base font-black text-[#17264A] leading-tight">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-600 mt-1">
                      {ach.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {ach.unlocked ? 'Unlocked ✔' : `${ach.progress}/${ach.maxProgress}`}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-slate-500 font-semibold mt-4">
              * Tap any unlocked badge to trigger celebration confetti!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
