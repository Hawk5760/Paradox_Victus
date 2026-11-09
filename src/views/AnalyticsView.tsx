import React from 'react';
import { ActiveTab, SubjectItem } from '../types';
import { sounds } from '../utils/soundEffects';
import { BarChart3, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

interface AnalyticsViewProps {
  subjects: SubjectItem[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ subjects, setActiveTab }) => {
  const trendData = [
    { month: 'Aug', pct: 60, x: 40, y: 150 },
    { month: 'Sep', pct: 70, x: 120, y: 115 },
    { month: 'Oct', pct: 80, x: 200, y: 80 },
    { month: 'Nov', pct: 86, x: 280, y: 58 },
  ];

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="/assets/panels/screen_10_analytics.png"
          alt="Analytics Background"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)]">
          {/* Header Banner matching Screen 10 */}
          <div className="bg-[#1e2a44] rounded-2xl p-3 sm:p-4 text-center text-white mb-6 shadow-md border-2 border-[#2b3d63] flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl">📊</span>
              <h2 className="font-['Baloo_2'] text-2xl sm:text-3xl font-black text-white tracking-wide">
                Attendance Analytics
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-sky-200 mt-0.5">
              Track your progress and attendance trends.
            </p>
          </div>

          {/* Grid Layout: Attendance Trend & Subject Distribution matching Screen 10 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Attendance Trend Line Chart matching Screen 10 */}
            <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-['Baloo_2'] text-lg sm:text-xl font-black text-[#17264A] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
                    <span>Attendance Trend</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +26% growth
                  </span>
                </div>

                {/* SVG Line Chart */}
                <div className="relative w-full h-48 sm:h-52 bg-slate-50/70 rounded-xl p-2 border border-slate-100">
                  <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                    {/* Horizontal grid lines */}
                    <line x1="30" y1="30" x2="310" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="30" y1="70" x2="310" y2="70" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="30" y1="110" x2="310" y2="110" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="30" y1="150" x2="310" y2="150" stroke="#e2e8f0" strokeDasharray="3 3" />

                    {/* Y-axis labels */}
                    <text x="5" y="34" className="text-[9px] fill-slate-400 font-bold font-mono">100%</text>
                    <text x="8" y="74" className="text-[9px] fill-slate-400 font-bold font-mono">80%</text>
                    <text x="8" y="114" className="text-[9px] fill-slate-400 font-bold font-mono">70%</text>
                    <text x="8" y="154" className="text-[9px] fill-slate-400 font-bold font-mono">60%</text>

                    {/* Trend Line (Aug 60% -> Sep 70% -> Oct 80% -> Nov 86%) */}
                    <path
                      d="M 50 150 Q 90 130 130 115 T 210 80 T 285 58"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    <circle cx="50" cy="150" r="4.5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="130" cy="115" r="4.5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="210" cy="80" r="4.5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="285" cy="58" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
                  </svg>

                  {/* Nov 86% Badge as in mockup */}
                  <div className="absolute top-2 right-4 bg-[#8b5cf6] text-white font-['Baloo_2'] text-xs font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">
                    86%
                  </div>

                  {/* Month Labels */}
                  <div className="flex justify-between px-8 text-xs font-bold text-slate-500 mt-1">
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center mt-3">
                Attendance increased steadily from 60% to 86% after using Bunk Planner AI!
              </div>
            </div>

            {/* Right Card: Subject Distribution Donut Chart matching Screen 10 */}
            <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-['Baloo_2'] text-lg sm:text-xl font-black text-[#17264A] mb-3 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#43B978]" />
                  <span>Subject Distribution</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#43B978"
                        strokeWidth="12"
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={2 * Math.PI * 38 * (1 - 0.86)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-['Baloo_2'] text-2xl font-black text-[#17264A]">
                        86%
                      </span>
                    </div>
                  </div>

                  {/* Breakdown Legend matching Screen 10 */}
                  <div className="space-y-1.5 w-full text-xs font-bold text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Maths
                      </span>
                      <strong className="font-mono">78%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> EEE
                      </span>
                      <strong className="font-mono">75%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Physics
                      </span>
                      <strong className="font-mono">86%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-600" /> Programming
                      </span>
                      <strong className="font-mono">93%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> English
                      </span>
                      <strong className="font-mono text-rose-600">71%</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center mt-3">
                English is your lowest subject (71%). Prioritize it in recovery planning!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
