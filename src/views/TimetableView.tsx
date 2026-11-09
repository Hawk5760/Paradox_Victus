import React, { useState } from 'react';
import { ActiveTab, TimetableEntry } from '../types';
import { sounds } from '../utils/soundEffects';
import { Calendar, Coffee, CheckSquare, Square, Laptop, BookOpen, Clock, MapPin } from 'lucide-react';

interface TimetableViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({ setActiveTab }) => {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'>('Thu');

  const [timetableData, setTimetableData] = useState<Record<string, TimetableEntry[]>>({
    Thu: [
      { id: '1', time: '9:00 AM', subject: 'Mathematics', room: 'Room A-102', attendedStatus: 'attended' },
      { id: '2', time: '10:00 AM', subject: 'EEE', room: 'Room B-204', attendedStatus: 'bunked' },
      { id: '3', time: '11:00 AM', subject: 'Break', room: 'Canteen Time', isBreak: true, attendedStatus: 'attended' },
      { id: '4', time: '11:30 AM', subject: 'Programming', room: 'Lab - L1', attendedStatus: 'attended' },
      { id: '5', time: '1:00 PM', subject: 'English', room: 'Room A-106', attendedStatus: 'attended' },
    ],
    Mon: [
      { id: 'm1', time: '9:00 AM', subject: 'Physics', room: 'Lab P-2', attendedStatus: 'attended' },
      { id: 'm2', time: '10:00 AM', subject: 'Mathematics', room: 'Room A-102', attendedStatus: 'attended' },
      { id: 'm3', time: '11:00 AM', subject: 'Break', room: 'Canteen Time', isBreak: true },
      { id: 'm4', time: '11:30 AM', subject: 'EEE', room: 'Room B-204', attendedStatus: 'attended' },
      { id: 'm5', time: '1:00 PM', subject: 'Library Hour', room: 'Central Library', attendedStatus: 'attended' },
    ],
    Tue: [
      { id: 't1', time: '9:00 AM', subject: 'Programming', room: 'Lab - L1', attendedStatus: 'attended' },
      { id: 't2', time: '10:00 AM', subject: 'Physics', room: 'Room A-104', attendedStatus: 'attended' },
      { id: 't3', time: '11:00 AM', subject: 'Break', room: 'Canteen Time', isBreak: true },
      { id: 't4', time: '11:30 AM', subject: 'English', room: 'Room A-106', attendedStatus: 'attended' },
      { id: 't5', time: '1:00 PM', subject: 'EEE Tutorial', room: 'Room B-204', attendedStatus: 'bunked' },
    ],
    Wed: [
      { id: 'w1', time: '9:00 AM', subject: 'Mathematics', room: 'Room A-102', attendedStatus: 'attended' },
      { id: 'w2', time: '10:00 AM', subject: 'Programming Lab', room: 'Lab - L1', attendedStatus: 'attended' },
      { id: 'w3', time: '11:00 AM', subject: 'Break', room: 'Canteen Time', isBreak: true },
      { id: 'w4', time: '11:30 AM', subject: 'Programming Lab', room: 'Lab - L1', attendedStatus: 'attended' },
      { id: 'w5', time: '1:00 PM', subject: 'Physics', room: 'Room A-104', attendedStatus: 'attended' },
    ],
    Fri: [
      { id: 'f1', time: '9:00 AM', subject: 'EEE', room: 'Room B-204', attendedStatus: 'attended' },
      { id: 'f2', time: '10:00 AM', subject: 'English', room: 'Room A-106', attendedStatus: 'attended' },
      { id: 'f3', time: '11:00 AM', subject: 'Break', room: 'Canteen Time', isBreak: true },
      { id: 'f4', time: '11:30 AM', subject: 'Mathematics', room: 'Room A-102', attendedStatus: 'bunked' },
      { id: 'f5', time: '1:00 PM', subject: 'Sports / Chill', room: 'Campus Ground', attendedStatus: 'attended' },
    ],
    Sat: [
      { id: 's1', time: '9:00 AM', subject: 'Programming Seminar', room: 'Auditorium', attendedStatus: 'attended' },
      { id: 's2', time: '10:30 AM', subject: 'Project Review', room: 'Room B-204', attendedStatus: 'attended' },
      { id: 's3', time: '11:45 AM', subject: 'Break', room: 'Canteen Time', isBreak: true },
      { id: 's4', time: '12:30 PM', subject: 'Half-Day Freedom', room: 'Hostel / Home', attendedStatus: 'attended' },
    ],
  });

  const currentSlots = timetableData[selectedDay] || [];
  const attendCount = currentSlots.filter((s) => !s.isBreak && s.attendedStatus === 'attended').length;
  const bunkCount = currentSlots.filter((s) => !s.isBreak && s.attendedStatus === 'bunked').length;

  const toggleSlotStatus = (id: string) => {
    sounds.playStamp();
    setTimetableData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((s) => {
        if (s.id !== id || s.isBreak) return s;
        const nextStatus = s.attendedStatus === 'attended' ? 'bunked' : 'attended';
        return { ...s, attendedStatus: nextStatus };
      }),
    }));
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="/assets/panels/screen_5_timetable.png"
          alt="Classroom desk timetable"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        {/* Main Board Container */}
        <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)]">
          {/* Header Banner */}
          <div className="bg-[#e06743] rounded-2xl p-3 sm:p-4 text-center text-white mb-6 shadow-md border-2 border-[#b54a2a] flex items-center justify-center gap-2">
            <span className="text-2xl">📅</span>
            <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-white tracking-wide">
              My Timetable
            </h2>
          </div>

          {/* Day Tabs matching Screen 5: Mon, Tue, Wed, Thu (active purple), Fri, Sat */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).map((day) => (
              <button
                key={day}
                onClick={() => {
                  sounds.playPop();
                  setSelectedDay(day);
                }}
                className={`flex-1 min-w-[50px] py-2 sm:py-2.5 rounded-xl font-['Baloo_2'] text-sm sm:text-base font-extrabold transition-all text-center ${
                  selectedDay === day
                    ? 'bg-[#8247e5] text-white shadow-[0_3px_0_#5a2baf] scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule Table and Right Sticky Note Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Timetable Rows matching Screen 5 */}
            <div className="lg:col-span-8 bg-white/90 rounded-2xl border-2 border-[#edd8b6] p-4 shadow-sm divide-y divide-slate-100">
              {currentSlots.map((slot) => {
                const isBreak = slot.isBreak;
                return (
                  <div
                    key={slot.id}
                    onClick={() => !isBreak && toggleSlotStatus(slot.id)}
                    className={`py-3 px-3 flex items-center justify-between gap-3 rounded-xl transition-colors ${
                      isBreak
                        ? 'bg-[#FFF2D6]/80 text-[#9c5f0a]'
                        : 'hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    {/* Time */}
                    <div className="w-20 sm:w-24 font-bold text-xs sm:text-sm text-slate-600 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.time}</span>
                    </div>

                    {/* Subject name & icon */}
                    <div className="flex-1 font-['Baloo_2'] font-bold text-sm sm:text-base text-[#17264A] flex items-center gap-2">
                      {isBreak ? (
                        <>
                          <span className="text-lg">☕</span>
                          <span className="font-black text-[#9c5f0a]">Break</span>
                        </>
                      ) : (
                        <>
                          <span>{slot.subject}</span>
                          {slot.attendedStatus === 'bunked' && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                              Bunked
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Room or Canteen details */}
                    <div className="text-right text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                      {isBreak ? (
                        <span className="flex items-center gap-1 text-[#9c5f0a] font-bold">
                          ☕ Canteen Time
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {slot.room}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Yellow Sticky Note matching Screen 5 ("Thu Plan") */}
            <div className="lg:col-span-4">
              <div className="bg-[#FFF475] rounded-2xl p-5 shadow-[0_8px_0_#d4c844,0_15px_20px_rgba(0,0,0,0.15)] border-2 border-[#e6da45] relative transform rotate-1">
                {/* Red pushpin */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#EA5353] border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/70" />
                </div>

                <div className="text-center font-['Baloo_2'] text-xl sm:text-2xl font-black text-[#17264A] mb-4 border-b border-black/10 pb-2">
                  {selectedDay} Plan
                </div>

                <div className="space-y-3 font-['Baloo_2'] text-base sm:text-lg font-bold text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-5 h-5 text-emerald-700" />
                    <span>Attend: <strong className="text-emerald-800 font-black">{attendCount}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Square className="w-5 h-5 text-rose-600" />
                    <span>Bunk: <strong className="text-rose-700 font-black">{bunkCount}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🥟</span>
                    <span>Canteen: <strong className="text-[#17264A]">✔ Ready</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 text-center">
                  <p className="text-[11px] font-bold text-slate-700 italic">
                    Tap any class to flip between Attend / Bunk!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
