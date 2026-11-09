import React, { useState } from 'react';
import { ActiveTab, ProfessorInfo } from '../types';
import { sounds } from '../utils/soundEffects';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, UserCheck, Flame } from 'lucide-react';

interface ProfessorRadarViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const ProfessorRadarView: React.FC<ProfessorRadarViewProps> = ({ setActiveTab }) => {
  const [selectedProfId, setSelectedProfId] = useState<string | null>('dubey');

  const professors: ProfessorInfo[] = [
    {
      id: 'dubey',
      name: 'Dubey Sir',
      subject: 'EEE',
      strictness: 'Very High',
      bunkRisk: "Don't Bunk",
      catchProbability: 98,
      quote: 'MAIN ROLL NUMBER DO BAAR CALL KARTA HU! EK SHURU MEIN, EK AAKHIR MEIN!',
      tip: 'Do NOT try proxy. He cross-checks faces with the admit card photo!',
      avatarSeed: 'dubey',
    },
    {
      id: 'mehta',
      name: "Mehta Ma'am",
      subject: 'Maths',
      strictness: 'High',
      bunkRisk: 'Risky',
      catchProbability: 75,
      quote: 'Calculus samajh nahi aayega toh exam mein kya integration karoge?',
      tip: 'Gives surprise attendance in the middle of long theorem derivations.',
      avatarSeed: 'mehta',
    },
    {
      id: 'kulkarni',
      name: 'Kulkarni Sir',
      subject: 'Physics',
      strictness: 'Medium',
      bunkRisk: 'Possible',
      catchProbability: 40,
      quote: 'Optics experiments chal rahe hain, lab record complete hona chahiye.',
      tip: 'Marks attendance via lab sheet sign-in. Easy if a friend signs for you.',
      avatarSeed: 'kulkarni',
    },
    {
      id: 'sharma',
      name: 'Sharma Sir',
      subject: 'Programming',
      strictness: 'Low',
      bunkRisk: 'Safe',
      catchProbability: 15,
      quote: 'Code run hona chahiye bas, chahe hostel se karo ya lab se.',
      tip: 'Super chill! He submits assignments online. Safe to bunk on coding days.',
      avatarSeed: 'sharma',
    },
  ];

  const getStrictnessBadge = (val: string) => {
    switch (val) {
      case 'Very High':
        return (
          <span className="bg-[#FFE0B2] text-[#E65100] font-bold text-xs px-2.5 py-1 rounded-lg border border-[#FFB74D]">
            Very High
          </span>
        );
      case 'High':
        return (
          <span className="bg-[#FFF9C4] text-[#F57F17] font-bold text-xs px-2.5 py-1 rounded-lg border border-[#FFF176]">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="bg-[#FFE082] text-[#8D6E63] font-bold text-xs px-2.5 py-1 rounded-lg border border-[#FFD54F]">
            Medium
          </span>
        );
      default:
        return (
          <span className="bg-[#C8E6C9] text-[#2E7D32] font-bold text-xs px-2.5 py-1 rounded-lg border border-[#A5D6A7]">
            Low
          </span>
        );
    }
  };

  const getBunkRiskBadge = (val: string) => {
    switch (val) {
      case "Don't Bunk":
        return (
          <span className="inline-flex items-center gap-1 text-[#EA5353] font-black text-xs sm:text-sm">
            <XCircle className="w-4 h-4 text-[#EA5353]" /> Don't Bunk
          </span>
        );
      case 'Risky':
        return (
          <span className="inline-flex items-center gap-1 text-[#FF963C] font-black text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4 text-[#FF963C]" /> Risky
          </span>
        );
      case 'Possible':
        return (
          <span className="inline-flex items-center gap-1 text-[#2E7D32] font-black text-xs sm:text-sm">
            <CheckCircle className="w-4 h-4 text-[#43B978]" /> Possible
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[#43B978] font-black text-xs sm:text-sm">
            <CheckCircle className="w-4 h-4 text-[#43B978]" /> Safe
          </span>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="/assets/panels/screen_7_radar.png"
          alt="Professor Radar Background"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Dubey Sir with crossed arms matching Screen 7 */}
        <div className="hidden lg:flex lg:col-span-4 flex-col items-center justify-center">
          <div className="relative group hover:scale-105 transition-transform duration-200">
            <div className="w-64 aspect-[3/4] rounded-3xl overflow-hidden drop-shadow-2xl border-4 border-[#EA5353] bg-gradient-to-t from-red-950/80 to-transparent">
              <img
                src="/assets/characters/dubeysir_arms_crossed.png"
                alt="Dubey Sir Stern"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/panels/screen_7_radar.png';
                }}
              />
            </div>
            {/* Warning note */}
            <div className="bg-[#EA5353] text-white font-['Baloo_2'] text-xs font-black p-3 rounded-2xl shadow-xl border-2 border-white mt-3 text-center">
              "Mere lecture mein bunk mara toh 0 internal marks dunga!" 😡
            </div>
          </div>
        </div>

        {/* Center/Right: Radar Board matching Screen 7 */}
        <div className="lg:col-span-8">
          <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)]">
            {/* Header Banner matching Screen 7 with binoculars and siren */}
            <div className="bg-[#1e2a44] rounded-2xl p-3 sm:p-4 text-center text-white mb-6 shadow-md border-2 border-[#2b3d63] flex flex-col items-center justify-center relative">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl">🔭</span>
                <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-white tracking-wide">
                  Professor Radar
                </h2>
                <span className="text-2xl sm:text-3xl animate-bounce">🚨</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-sky-200 mt-0.5">
                Know your professors & their attendance strictness!
              </p>
            </div>

            {/* Professor Table matching Screen 7 */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden mb-5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Professor</th>
                    <th className="py-3 px-4 text-center">Strictness</th>
                    <th className="py-3 px-4 text-right">Bunk Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {professors.map((prof) => {
                    const isSelected = selectedProfId === prof.id;
                    return (
                      <React.Fragment key={prof.id}>
                        <tr
                          onClick={() => {
                            sounds.playPop();
                            setSelectedProfId(isSelected ? null : prof.id);
                          }}
                          className={`hover:bg-amber-50/40 cursor-pointer transition-colors ${
                            isSelected ? 'bg-amber-50/70' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 aspect-square rounded-full bg-[#17264A] text-white flex items-center justify-center font-black text-xs border border-[#FFD43B] shrink-0">
                                {prof.name[0]}
                              </div>
                              <div>
                                <div className="font-['Baloo_2'] font-bold text-sm sm:text-base text-[#17264A]">
                                  {prof.name} <span className="text-slate-500 text-xs font-normal">({prof.subject})</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {getStrictnessBadge(prof.strictness)}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {getBunkRiskBadge(prof.bunkRisk)}
                          </td>
                        </tr>

                        {/* Expandable Dossier */}
                        {isSelected && (
                          <tr className="bg-amber-50/40">
                            <td colSpan={3} className="px-4 py-3 border-t border-dashed border-amber-200">
                              <div className="text-xs space-y-1.5 text-slate-700">
                                <div className="font-bold text-[#EA5353] italic">
                                  "{prof.quote}"
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <span className="font-extrabold text-slate-800">Survival Tip:</span>
                                  <span>{prof.tip}</span>
                                </div>
                                <div className="flex items-center gap-3 pt-1">
                                  <span className="text-[11px] font-bold text-slate-500">
                                    Catch Probability:
                                  </span>
                                  <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        prof.catchProbability > 70
                                          ? 'bg-[#EA5353]'
                                          : prof.catchProbability > 30
                                          ? 'bg-[#FF963C]'
                                          : 'bg-[#43B978]'
                                      }`}
                                      style={{ width: `${prof.catchProbability}%` }}
                                    />
                                  </div>
                                  <span className="font-mono font-bold text-xs">
                                    {prof.catchProbability}%
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick Action Footer */}
            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <span>* Click any professor to view attendance tips & catch probability.</span>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('predictor');
                }}
                className="font-bold text-[#17264A] underline hover:text-[#9c5f0a]"
              >
                Go to Bunk Predictor ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
