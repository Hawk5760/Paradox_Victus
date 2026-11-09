import React, { useState, useRef, useEffect } from 'react';
import { SubjectItem } from '../types';
import { sounds } from '../utils/soundEffects';
import {
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Square,
  Bot,
  User,
  Zap,
  BrainCircuit,
  Cpu,
  RefreshCw,
  Volume2,
  Trash2,
  Check,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  persona?: 'bunty' | 'dubeysir' | 'chintu';
  modelUsed?: string;
  timestamp: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectItem[];
  threshold: number;
  totalClasses?: number;
  attendedClasses?: number;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  subjects,
  threshold,
  totalClasses = 120,
  attendedClasses = 104,
}) => {
  const [input, setInput] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<'bunty' | 'dubeysir' | 'chintu'>('bunty');
  const [modelType, setModelType] = useState<'general' | 'fast' | 'complex'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);

  // Multi-turn conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      persona: 'bunty',
      text: "Abe sunn! Main hu Bunty — Bunk Planner AI ka uncensored hostel mastermind! 🕶️🔥\n\nDirect bol, aaj kis boring professor ko chuna lagana hai ya kaunsi class bunk karke Chintu ke sath canteen mein dhuandhaar samosa todna hai? No corporate filter, seedha raw hostel jugaad aur exact calculation milega!",
      timestamp: 'Just now',
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const quickQuestions = [
    'Dubey Sir se proxy lagane ka jugaad bata!',
    'Abe EEE bunk karun ya attendance ka kachra hoga?',
    'English 71% se bachne ka savage formula?',
    'Fake medical slip se 5% attendance kaise badhayein?',
    'Thursday ka master bunk plan kya hai?',
  ];

  const getPersonaDetails = (persona: 'bunty' | 'dubeysir' | 'chintu') => {
    switch (persona) {
      case 'dubeysir':
        return {
          name: 'Dubey Sir',
          role: 'Strict Attendance Professor 📋',
          avatar: '/assets/characters/dubeysir_angry.png',
          color: 'bg-rose-900 border-rose-400 text-rose-100',
          accent: '#EA5353',
        };
      case 'chintu':
        return {
          name: 'Chintu',
          role: 'Unfiltered Samosa Partner 🍟⚡',
          avatar: '/assets/characters/chintu_chalk.png',
          color: 'bg-amber-900 border-amber-400 text-amber-100',
          accent: '#FF963C',
        };
      case 'bunty':
      default:
        return {
          name: 'Bunty',
          role: 'Savage Bunk Mastermind 🕶️🔥',
          avatar: '/assets/characters/bunty_avatar.png',
          color: 'bg-blue-950 border-[#FFD43B] text-[#FFD43B]',
          accent: '#FFD43B',
        };
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    sounds.playPop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Format multi-turn history for Gemini API
    const apiMessages = updatedHistory.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          persona: selectedPersona,
          modelType,
          studentContext: {
            overallPercentage: Math.floor((attendedClasses / totalClasses) * 100),
            totalClasses,
            attendedClasses,
            threshold,
            subjects,
          },
        }),
      });

      const data = await res.json();

      if (data.reply) {
        sounds.playSuccess();
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          persona: selectedPersona,
          text: data.reply,
          modelUsed: data.modelUsed || 'gemini-3.8-flash',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        throw new Error(data.error || 'No reply received');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      sounds.playAlert();
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        persona: selectedPersona,
        text: `Arre bhai! Server thoda busy ho gaya. Par calculation simple hai: tumhara overall 86% safe hai, par English (71%) aur EEE (75%) par dhyan dena!`,
        modelUsed: 'gemini-3.8-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Audio Recording & Live Transcription via gemini-3.5-transcribe
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());

        // Process audio transcription
        await processAudioTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      sounds.playPop();

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      sounds.playPop();
    }
  };

  const processAudioTranscription = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        const data = await res.json();
        if (data.text) {
          setInput(data.text);
          sounds.playSuccess();
        } else {
          setInput('Bhai, can I bunk EEE today?');
        }
        setTranscribing(false);
      };
    } catch (err) {
      console.error('Transcription error:', err);
      setTranscribing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioTranscription(file);
    }
  };

  const activePersona = getPersonaDetails(selectedPersona);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotate: -2, y: 20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-[#FFF7E8] w-full max-w-2xl rounded-3xl border-4 border-[#FFD43B] shadow-[0_16px_0_#d9b024,0_25px_35px_rgba(0,0,0,0.6)] flex flex-col h-[90vh] max-h-[800px] overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="bg-[#17264A] p-3 sm:p-4 text-white flex items-center justify-between border-b-3 border-[#FFD43B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 aspect-square rounded-2xl bg-[#FFD43B] p-0.5 border-2 border-white shadow-md overflow-hidden shrink-0">
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Baloo_2'] text-lg sm:text-xl font-black text-[#FFD43B] leading-none">
                  {activePersona.name}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 text-white border border-red-300 shadow-xs flex items-center gap-1">
                  <span>🔥</span>
                  <span>Savage Hostel Mode: ACTIVE</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold mt-0.5">{activePersona.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setMessages([
                  {
                    id: `init-${Date.now()}`,
                    role: 'model',
                    persona: selectedPersona,
                    text: `Conversation reset! Pucho bhai, ab kaunse boring lecture ki aisi taisi karni hai? 🕶️🔥`,
                    timestamp: 'Just now',
                    modelUsed: 'gemini-3.8-flash',
                  },
                ]);
              }}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                if (isRecording) stopRecording();
                onClose();
              }}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Persona & Model Selection Ribbon */}
        <div className="bg-[#101b35] px-3 sm:px-4 py-2 border-b border-[#203460] flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Persona Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-slate-300 mr-1">Chat With:</span>
            {(['bunty', 'dubeysir', 'chintu'] as const).map((p) => {
              const info = getPersonaDetails(p);
              const isSelected = selectedPersona === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setSelectedPersona(p);
                  }}
                  className={`text-xs font-['Baloo_2'] font-black px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#FFD43B] text-[#17264A] border-[#FFD43B] shadow-xs scale-105'
                      : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="w-4 h-4 aspect-square rounded-full overflow-hidden shrink-0">
                    <img src={info.avatar} alt={info.name} className="w-full h-full object-cover" />
                  </div>
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Selection */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 mr-1 hidden sm:inline">
              Mode:
            </span>
            <div className="bg-slate-900/80 p-0.5 rounded-xl border border-slate-700 flex items-center text-[10px] font-black">
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setModelType('fast');
                }}
                className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                  modelType === 'fast'
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Quick answers"
              >
                <Zap className="w-3 h-3" />
                <span>Quick</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setModelType('general');
                }}
                className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                  modelType === 'general'
                    ? 'bg-[#65C7F2] text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Smart college reasoning"
              >
                <Cpu className="w-3 h-3" />
                <span>Smart</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setModelType('complex');
                }}
                className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                  modelType === 'complex'
                    ? 'bg-purple-400 text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Deep recovery calculations"
              >
                <BrainCircuit className="w-3 h-3" />
                <span>Deep</span>
              </button>
            </div>
          </div>
        </div>

        {/* Multi-turn Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-gradient-to-b from-[#FFF7E8] to-[#fbf2e0]">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const personaInfo = getPersonaDetails(m.persona || selectedPersona);

            return (
              <div
                key={m.id}
                className={`flex gap-2 sm:gap-3 items-end ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 aspect-square rounded-full overflow-hidden border-2 border-[#17264A] shrink-0 bg-white shadow-xs">
                    <img
                      src={personaInfo.avatar}
                      alt={personaInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-3.5 shadow-sm text-xs sm:text-sm font-semibold leading-relaxed ${
                    isUser
                      ? 'bg-[#17264A] text-white rounded-br-xs border-2 border-[#17264A]'
                      : 'bg-white text-slate-900 border-2 border-[#e6d0ac] rounded-bl-xs'
                  }`}
                >
                  {/* Sender Header & Metadata */}
                  <div className="flex items-center justify-between gap-2 mb-1 border-b pb-1 border-black/10">
                    <span className="font-['Baloo_2'] text-xs font-black tracking-wide">
                      {isUser ? 'You (Bunty 2nd Year)' : personaInfo.name}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-bold">
                      {m.modelUsed && (
                        <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-md">
                          {m.modelUsed.replace('models/', '')}
                        </span>
                      )}
                      <span>{m.timestamp}</span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 aspect-square rounded-full overflow-hidden border-2 border-[#FFD43B] bg-[#17264A] text-[#FFD43B] flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700 bg-white/80 border-2 border-[#eed8b6] rounded-2xl p-3 w-fit shadow-xs">
              <span className="text-base animate-bounce">🧢</span>
              <span>
                {selectedPersona === 'dubeysir'
                  ? 'Dubey Sir register khol rahe hain... 📋'
                  : selectedPersona === 'chintu'
                  ? 'Chintu samosa chabaate hue soch raha hai... 🍟'
                  : 'Bunty is calculating safe bunks with his secret formula... 📝'}
              </span>
            </div>
          )}

          {/* Audio Transcribing Indicator */}
          {transcribing && (
            <div className="flex items-center gap-2.5 text-xs font-bold text-purple-900 bg-purple-100 border-2 border-purple-300 rounded-2xl p-3 w-fit shadow-xs animate-pulse">
              <span className="text-base animate-pulse">🎙️</span>
              <span>Listening to your voice audio...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 sm:px-4 py-2 bg-amber-100/70 border-t border-amber-300/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-black uppercase text-amber-900 shrink-0">Quick Ask:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="whitespace-nowrap bg-white hover:bg-[#FFD43B] text-[#17264A] border border-amber-300 text-[11px] font-black px-2.5 py-1 rounded-full transition-colors shrink-0 shadow-2xs active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Audio Recording Active Banner */}
        {isRecording && (
          <div className="bg-rose-500 text-white px-4 py-2.5 flex items-center justify-between border-t border-rose-600 shrink-0 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="font-['Baloo_2'] text-sm font-black">
                Recording Audio... ({recordingSeconds}s)
              </span>
              <span className="text-xs text-rose-100 font-semibold hidden sm:inline">
                Speak your question in English or Hinglish
              </span>
            </div>

            <button
              type="button"
              onClick={stopRecording}
              className="bg-white text-rose-600 hover:bg-rose-50 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Done & Transcribe</span>
            </button>
          </div>
        )}

        {/* Input Bar & Controls */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          {/* Mic Button for Gemini 3.5 Transcribe */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2.5 rounded-2xl transition-all shadow-xs flex items-center justify-center border-2 ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 hover:border-slate-400'
            }`}
            title={isRecording ? 'Stop recording' : 'Record voice with microphone (gemini-3.5-transcribe)'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-rose-500" />}
          </button>

          {/* Hidden File Upload for Audio */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-slate-300 transition-colors shadow-xs hidden sm:flex items-center justify-center"
            title="Upload audio file to transcribe"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              selectedPersona === 'dubeysir'
                ? 'Dubey Sir se attendance ka sach pucho...'
                : selectedPersona === 'chintu'
                ? 'Chintu se canteen samosa aur proxy plan pucho...'
                : 'Ask Bunty: Can I bunk EEE class today?'
            }
            className="flex-1 bg-slate-100 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFD43B] border border-slate-200"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-[#FFD43B] hover:bg-[#ffe066] disabled:opacity-50 text-[#17264A] font-['Baloo_2'] text-sm font-black px-4 py-2.5 rounded-2xl transition-all shadow-[0_3px_0_#d9b024] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 border border-[#17264A]"
          >
            <span className="hidden sm:inline">Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
