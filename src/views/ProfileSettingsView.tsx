import React, { useState } from 'react';
import { ActiveTab, StudentProfile } from '../types';
import { sounds } from '../utils/soundEffects';
import { Edit3, Check, User, Bell, Moon, Sun, Building2, Save } from 'lucide-react';

interface ProfileSettingsViewProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  threshold: number;
  setThreshold: (val: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  setProfile,
  threshold,
  setThreshold,
  setActiveTab,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editCollege, setEditCollege] = useState(profile.college);
  const [editRole, setEditRole] = useState(profile.role);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveProfile = () => {
    sounds.playSuccess();
    setProfile((prev) => ({
      ...prev,
      name: editName,
      college: editCollege,
      role: editRole,
    }));
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const toggleNotifications = () => {
    sounds.playPop();
    setProfile((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const toggleDarkMode = () => {
    sounds.playPop();
    setProfile((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#17264A] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="/assets/panels/screen_12_profile.png"
          alt="Profile Settings Background"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="bg-[#FFF7E8] rounded-3xl p-5 sm:p-8 border-4 border-[#FFD43B] shadow-[0_12px_0_#d9b024,0_20px_25px_rgba(0,0,0,0.5)]">
          {/* Main Grid: Left Profile Card, Center Settings Card, Right Peeking Characters matching Screen 12 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Card: Student Profile matching Screen 12 */}
            <div className="md:col-span-5 bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex flex-col items-center text-center relative">
              {/* Circular Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-full overflow-hidden border-4 border-[#FFD43B] shadow-md mb-3 bg-sky-200 shrink-0">
                <img
                  src="/assets/characters/bunty_avatar.png"
                  alt="Bunty Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {!isEditing ? (
                <>
                  <h3 className="font-['Baloo_2'] text-2xl font-black text-[#17264A]">
                    {profile.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mb-1">
                    {profile.role}
                  </p>
                  <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{profile.college}</span>
                  </p>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      setIsEditing(true);
                    }}
                    className="bg-[#203460] hover:bg-[#284178] text-[#FFD43B] font-['Baloo_2'] text-xs font-bold px-4 py-1.5 rounded-full border border-[#2d467c] flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <div className="w-full space-y-2 text-left">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg px-2 py-1 text-xs font-bold text-[#17264A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Year / Branch</label>
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg px-2 py-1 text-xs font-bold text-[#17264A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">College</label>
                    <input
                      type="text"
                      value={editCollege}
                      onChange={(e) => setEditCollege(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg px-2 py-1 text-xs font-bold text-[#17264A]"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-[#43B978] text-white text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Save className="w-3 h-3" /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 bg-slate-200 text-slate-700 text-xs font-bold py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {savedMessage && (
                <div className="absolute -top-3 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md animate-in fade-in">
                  Profile updated!
                </div>
              )}
            </div>

            {/* Center/Right: Settings Box matching Screen 12 */}
            <div className="md:col-span-7 bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-['Baloo_2'] text-xl font-black text-[#17264A] mb-4">
                  Settings
                </h4>

                <div className="space-y-4">
                  {/* Attendance Threshold Selector matching Screen 12 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800">
                        Attendance Threshold
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Minimum % to avoid exam debarment
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        value={threshold}
                        onChange={(e) => {
                          sounds.playPop();
                          setThreshold(parseInt(e.target.value));
                        }}
                        className="bg-[#FFF7E8] border-2 border-slate-300 rounded-xl px-3 py-1.5 font-['Baloo_2'] font-bold text-sm text-[#17264A] appearance-none cursor-pointer pr-7"
                      >
                        <option value={75}>75%</option>
                        <option value={80}>80%</option>
                        <option value={85}>85%</option>
                        <option value={90}>90%</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* College / Semester selector matching Screen 12 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800">
                        College / Semester
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Current academic semester
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        defaultValue="git-2"
                        className="bg-[#FFF7E8] border-2 border-slate-300 rounded-xl px-3 py-1.5 font-['Baloo_2'] font-bold text-xs sm:text-sm text-[#17264A] appearance-none cursor-pointer pr-7"
                      >
                        <option value="git-2">GIT – 2nd Year</option>
                        <option value="git-3">GIT – 3rd Year</option>
                        <option value="git-4">GIT – 4th Year</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Notifications toggle switch matching Screen 12 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800">
                        Notifications
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Daily bunk recommendation alerts
                      </div>
                    </div>
                    <button
                      onClick={toggleNotifications}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        profile.notifications ? 'bg-[#3b82f6]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          profile.notifications ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dark Mode toggle switch matching Screen 12 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800">
                        Dark Mode
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Night study cartoon theme
                      </div>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        profile.darkMode ? 'bg-[#3b82f6]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          profile.darkMode ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Peeking Characters strip from Screen 12 */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <div className="w-48 sm:w-56 aspect-[16/7] rounded-xl overflow-hidden drop-shadow-sm border border-slate-200">
                  <img
                    src="/assets/characters/trio_peeking.png"
                    alt="Bunty, Chintu, Dubey Sir peeking"
                    className="w-full h-full object-cover object-bottom"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/panels/screen_12_profile.png';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
