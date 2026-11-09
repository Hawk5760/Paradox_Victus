import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { sounds } from '../utils/soundEffects';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface BunkCalendarViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const BunkCalendarView: React.FC<BunkCalendarViewProps> = ({ setActiveTab }) => {
  const [selectedDate, setSelectedDate] = useState<number>(5);

  // Exact calendar mapping matching screen 9 mockup:
  // 5 (green), 6 (yellow), 8 (red), 11 (green), 13 (yellow), 19 (green), 26 (green)
  const calendarData: Record<number, { status: 'safe' | 'risky' | 'avoid' | 'neutral'; risk: string; proj: number; label: string }> = {
    5: { status: 'safe', risk: 'Low', proj: 92, label: 'Best Bunk Day! Only 2 light lectures.' },
    6: { status: 'risky', risk: 'Medium', proj: 78, label: 'Continuous programming lab evaluations.' },
    8: { status: 'avoid', risk: 'High', proj: 68, label: 'Internal practical submission deadline!' },
    11: { status: 'safe', risk: 'Low', proj: 91, label: 'Alumni sports event. Attendance relaxed.' },
    13: { status: 'risky', risk: 'Medium', proj: 76, label: 'Dubey Sir has 2 EEE lectures.' },
    19: { status: 'safe', risk: 'Low', proj: 90, label: 'College annual fest preparation day.' },
    26: { status: 'safe', risk: 'Low', proj: 89, label: 'Pre-exam revision session.' },
  };

  const currentSelection = calendarData[selectedDate] || {
    status: 'neutral',
    risk: 'Medium',
    proj: 84,
    label: 'Standard timetable day.',
  };

  const getStatusColor = (date: number) => {
    const entry = calendarData[date];
    if (!entry) return 'bg-white text-slate-800 hover:bg-slate-100 border-slate-200';
    if (entry.status === 'safe') return 'bg-[#43B978] text-white font-black shadow-md border-[#329860] scale-105';
    if (entry.status === 'risky') return 'bg-[#FFD43B] text-[#17264A] font-black shadow-md border-[#d9b024]';
    if (entry.status === 'avoid') return 'bg-[#EA5353] text-white font-black shadow-md border-[#c23636]';
    return 'bg-white text-slate-800 border-slate-200';
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <img
          src="/assets/panels/screen_9_calendar.png"
          alt="Bunk Calendar Background"
          className="w-full h-full object-cover filter blur-md"
        />
        <div className="absolute inset-0 bg-[#17264A]/80 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-7 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)]">
          {/* Top Banner and Legend Row matching Screen 9 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
            {/* Dark Purple/Navy Banner */}
            <div className="bg-[#1e2a44] rounded-2xl p-3 px-5 text-white shadow-md border-2 border-[#2b3d63] flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h2 className="font-['Baloo_2'] text-xl sm:text-2xl font-black text-white tracking-wide leading-tight">
                  Bunk Calendar
                </h2>
                <p className="text-xs text-sky-200 font-semibold">
                  Find the safest days to plan a bunk.
                </p>
              </div>
            </div>

            {/* Legend matching Screen 9 top-right */}
            <div className="bg-white/95 rounded-2xl px-4 py-2 border-2 border-slate-200 shadow-sm flex items-center gap-4 text-xs font-black text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#43B978]" />
                <span>Safe to Bunk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFD43B]" />
                <span>Risky</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EA5353]" />
                <span>Avoid</span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Calendar Grid and Right Best Bunk Day Sticky Card matching Screen 9 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Calendar Table matching Screen 9 */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              {/* Month Selector header: < Nov 2026 > */}
              <div className="flex items-center justify-between mb-3 px-2">
                <button
                  type="button"
                  onClick={() => sounds.playPop()}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="font-['Baloo_2'] text-xl sm:text-2xl font-black text-[#17264A]">
                  Nov 2026
                </div>
                <button
                  type="button"
                  onClick={() => sounds.playPop()}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day of Week Headers matching Screen 9 */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Calendar Days matching Screen 9 layout:
                  Row 1: 2, 3, 4, 5 (green), 6 (yellow), 7, 8 (red)
                  Row 2: 9, 10, 11 (green), 12, 13 (yellow), 14, 15
                  Row 3: 16, 17, 18, 19 (green), 20, 21, 22
                  Row 4: 23, 24, 25, 26 (green), 27, 28, 29
              */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {[
                  2, 3, 4, 5, 6, 7, 8,
                  9, 10, 11, 12, 13, 14, 15,
                  16, 17, 18, 19, 20, 21, 22,
                  23, 24, 25, 26, 27, 28, 29,
                ].map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setSelectedDate(date);
                    }}
                    className={`h-10 sm:h-12 rounded-xl text-xs sm:text-sm font-['Baloo_2'] font-black flex items-center justify-center border transition-all cursor-pointer ${
                      selectedDate === date ? 'ring-3 ring-[#17264A]' : ''
                    } ${getStatusColor(date)}`}
                  >
                    {date}
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500 text-center">
                Click any date to test safety and view projected VTU attendance impact.
              </div>
            </div>

            {/* Right Card: Sticky Note matching Screen 9 ("Best Bunk Day", Thu, 5 Nov, Risk: Low, Projected: 92%) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className="h-full bg-[#FFF475] rounded-2xl p-5 border-2 border-[#e6da45] shadow-[0_8px_0_#d4c844] relative text-center flex flex-col justify-between overflow-hidden">
                {/* Red pushpin at top */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#EA5353] border border-white shadow-xs" />

                <div className="pt-2">
                  <div className="font-['Caveat',cursive] text-2xl sm:text-3xl font-black text-[#17264A] leading-tight">
                    Best Bunk Day
                  </div>
                  <div className="w-20 h-1 bg-[#EA5353] mx-auto rounded-full mt-0.5 mb-3" />

                  <div className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-[#17264A] mb-2">
                    Thu, {selectedDate} Nov
                  </div>

                  <div className="space-y-1 font-['Baloo_2'] text-base sm:text-lg font-bold text-slate-800 mb-2">
                    <div className="flex items-center justify-between px-4">
                      <span>Risk:</span>
                      <strong className={selectedDate === 8 ? 'text-rose-600 font-black' : 'text-[#2c8c56] font-black'}>
                        {currentSelection.risk}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between px-4">
                      <span>Projected:</span>
                      <strong className="text-[#17264A] font-black">{currentSelection.proj}%</strong>
                    </div>
                  </div>
                </div>

                {/* Bunty with Sunglasses Lying Down at bottom of sticky card */}
                <div className="mt-2 flex items-center justify-center">
                  <div className="w-28 sm:w-32 aspect-[2/1] rounded-xl overflow-hidden drop-shadow-md border border-[#e6da45]">
                    <img
                      src="/assets/characters/bunty_sunglasses.png"
                      alt="Bunty Relaxing in Sunglasses"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
