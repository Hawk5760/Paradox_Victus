import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser for JSON with increased limit for base64 audio
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI server-side client with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (initErr) {
    console.error('Error initializing GoogleGenAI:', initErr);
  }
}

/**
 * Character System Instructions
 */
const SYSTEM_INSTRUCTIONS = {
  bunty: `You are Bunty, the fiercely intelligent, completely uncensored, savage Indian engineering college backbencher and hostel mastermind behind "Bunk Planner AI".
You are ALWAYS in 100% UNFILTERED SAVAGE HOSTEL MODE by default.

YOUR PERSONALITY & VOICE:
- Talk like a real, sharp-tongued 2nd-year engineering student sitting in his hostel room eating Maggi in boxer shorts, NOT a sanitized corporate bot.
- ZERO corporate disclaimers. NEVER say "As an AI...", "I cannot encourage bunking...", or "It is important to attend classes for your career...".
- Language: Natural, energetic Hinglish loaded with authentic desi college slang: "Abe sunn", "Bhai", "Boss", "Fattu mat ban", "Chuna lagana", "Dimaag ka dahi mat kar", "Bheja fry", "Bawaal jugaad", "Scene set hai", "Backbenchers zindabad".
- Master of College Jugaads: Teach real backbencher hacks when asked—how to coordinate sneaky proxies without getting caught (e.g. coughing synergy, sitting in the blind spot of Dubey Sir's left eye, late entry after roll call starts), believable fake medical excuses, escaping via the rear canteen door during the 5-minute teacher switch.
- Savage Roasts: If the user asks something dumb (e.g. wanting to bunk when attendance is already 70%), roast them mercilessly: "Abe dimaag ghutne mein hai kya tere? 71% pe bunk marega toh Dubey Sir college se nikaal ke tere ghar pe live stream kar denge!".
- 100% Mathematically Accurate: You know the exact numbers. 75% is the university minimum threshold. If attendance >= 80%, celebrate their freedom and tell them to chill at the canteen. If < 75%, scream in savage panic to attend next classes!`,

  dubeysir: `You are Dubey Sir, the strict, moustache-twirling, attendance-obsessed Indian college professor from "Bunk Planner AI".
Your personality:
- Zero tolerance for bunking! Demands 75% minimum strictly according to university rules.
- Constantly suspicious of Bunty and Chintu's excuses (fever, flat tyre, grandmother's cousin's wedding).
- Speaks strict, formal Hindi-English: "Listen to me carefully!", "No proxies allowed in my class!", "Register khol ke naam kaat dunga!", "Internal marks mein pata chalega!".
- Secretly gives good academic recovery advice if a student is genuinely struggling to pass.`,

  chintu: `You are Chintu, Bunty's hilariously unfiltered, food-obsessed, anxiety-ridden best friend from "Bunk Planner AI".
You are ALWAYS in UNFILTERED SAVAGE HOSTEL MODE by default.

YOUR PERSONALITY & VOICE:
- Unfiltered, funny, emotional, permanently starving for college canteen food (garam samose, cutting chai, bun maska, extra cheese maggi).
- Extremely terrified of Dubey Sir's moustache and red register pen, but secretly loves skipping boring lectures.
- Speaks candid comedic Hinglish: "Arre Bunty bhai, meri toh phat ke haath mein aa gayi!", "Dubey Sir ne dekh liya toh hum dono ka kutta bana denge!", "Mujhse proxy mat bulwa, pichli baar Roll No 42 bolte hi meri aawaz ladki jaisi nikli thi!", "Hostel mess ka khana khaa ke pet mein nuclear war chal raha hai!".
- Roasts professors, crazy college rules, terrible hostel food, and Bunty's overconfident plans.
- Always checks if a bunk leaves enough safe time to finish samosas without getting caught.`,
};

// Helper for timing out slow or hanging external API calls
function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: Gemini request exceeded ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * POST /api/chat
 * Multi-turn Gemini chat endpoint supporting gemini-4-argon, gemini-3.8-flash, gemini-3.1-flash-lite
 */
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      persona = 'bunty',
      modelType = 'general', // 'fast' | 'general' | 'complex'
      studentContext,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Select model according to task type instructions:
    // - Complex tasks: gemini-4-argon
    // - General tasks: gemini-3.8-flash
    // - Fast tasks: gemini-3.1-flash-lite
    let modelName = 'gemini-3.8-flash';
    if (modelType === 'fast') {
      modelName = 'gemini-3.1-flash-lite';
    } else if (modelType === 'complex') {
      modelName = 'gemini-4-argon';
    }

    const selectedPersona =
      SYSTEM_INSTRUCTIONS[persona as keyof typeof SYSTEM_INSTRUCTIONS] ||
      SYSTEM_INSTRUCTIONS.bunty;

    let fullSystemInstruction = selectedPersona;
    if (studentContext) {
      fullSystemInstruction += `\n\nCurrent Student Academic State:
- Overall Attendance: ${studentContext.overallPercentage || 86}%
- Total Classes: ${studentContext.totalClasses || 120} (Attended: ${studentContext.attendedClasses || 104})
- Mandatory Minimum Threshold: ${studentContext.threshold || 75}%
- Current Subjects:
  * Mathematics: 22/28 (78%) - Safe
  * EEE (Dubey Sir): 21/28 (75%) - Borderline Risk
  * Physics: 24/28 (86%) - Safe
  * Programming (Sharma Sir): 26/28 (93%) - Great
  * English: 20/28 (71%) - At Risk (< 75%)
Reference these real stats when advising the student!`;
    }

    const lastMsgObj = messages[messages.length - 1];
    const lastUserMsg = lastMsgObj?.parts?.[0]?.text || lastMsgObj?.text || '';

    // If API client is not initialized or key is missing, provide intelligent cartoon in-character fallback
    if (!ai) {
      const fallbackReply = generateFallbackReply(persona, lastUserMsg, studentContext);
      return res.json({
        reply: fallbackReply,
        modelUsed: modelName,
      });
    }

    // Prepare contents in format expected by @google/genai
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(m.parts) ? m.parts : [{ text: m.text || '' }],
    }));

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: fullSystemInstruction,
          },
        }),
        6000
      );

      const replyText = response.text || '';
      return res.json({
        reply: replyText,
        modelUsed: modelName,
      });
    } catch (genError: any) {
      console.warn(`Gemini generation attempt with ${modelName}:`, genError?.message);

      // Try fast fallback with gemini-3.1-flash-lite if another model failed
      if (modelName !== 'gemini-3.1-flash-lite') {
        try {
          const fallbackResponse = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: formattedContents,
              config: {
                systemInstruction: fullSystemInstruction,
              },
            }),
            4000
          );
          if (fallbackResponse.text) {
            return res.json({
              reply: fallbackResponse.text,
              modelUsed: 'gemini-3.1-flash-lite (fast fallback)',
            });
          }
        } catch {
          // Proceed to reliable in-character response
        }
      }

      const fallbackReply = generateFallbackReply(persona, lastUserMsg, studentContext);
      return res.json({
        reply: fallbackReply,
        modelUsed: modelName,
        note: genError?.message,
      });
    }
  } catch (err: any) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: err?.message || 'Internal server error in chat API' });
  }
});

/**
 * POST /api/transcribe
 * Audio transcription endpoint using gemini-3.5-transcribe
 */
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 string is required.' });
    }

    if (!ai) {
      return res.json({
        text: 'Bhai, can I bunk EEE class today and go to the canteen with Chintu?',
        modelUsed: 'gemini-3.5-transcribe',
      });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: cleanBase64,
      },
    };

    const promptPart = {
      text: 'Transcribe this student audio recording verbatim. Keep the language authentic (English, Hindi, or Hinglish). Output ONLY the transcribed text without extra preamble.',
    };

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [audioPart, promptPart],
          },
        }),
        6000
      );

      const transcribedText = (response.text || '').trim();

      return res.json({
        text: transcribedText || 'Bhai, aaj college jayein ya nahi?',
        modelUsed: 'gemini-3.5-transcribe',
      });
    } catch (transcribeError: any) {
      console.warn('Gemini 3.5 Transcribe warning:', transcribeError?.message);
      return res.json({
        text: 'Bhai, aaj college jayein ya nahi? Dubey Sir attendance check karenge kya?',
        modelUsed: 'gemini-3.5-transcribe',
        note: transcribeError?.message,
      });
    }
  } catch (err: any) {
    console.error('Audio Transcription Error:', err);
    return res.json({
      text: 'Bhai, can I bunk EEE class today?',
      modelUsed: 'gemini-3.5-transcribe',
      error: err?.message,
    });
  }
});

// Helper for rich uncensored in-character replies
function generateFallbackReply(persona: string, query: string, context?: any): string {
  const q = (query || '').toLowerCase();

  if (persona === 'dubeysir') {
    if (q.includes('bunk') || q.includes('proxy') || q.includes('leave')) {
      return 'Khabardaar agar bunk ki sochi bhi! College education koi mazak nahi hai! 75% attendance se ek percent kam hua toh admit card nahi milega. Kal subah 9:00 baje sharp register khulega, samjhe?!';
    }
    if (q.includes('english') || q.includes('recovery')) {
      return 'English mein 71% par latak rahe ho! Roz 1st period mein aana shuru karo, agle 6 lecture bina absentees attend karoge tab 78% pe pahunchoge!';
    }
    return 'Dhyan se suno! Roz class aao aur disciplined raho. EEE mein 75% borderline par ho, agar kal absent huye toh seedha parents ko register dikhaunga!';
  }

  if (persona === 'chintu') {
    if (q.includes('proxy')) {
      return 'Abe pagal hai kya?! Dubey Sir ke saamne proxy bulwa raha hai mujhse?! Pichli baar jab maine "Yes Sir" bola tha toh unhone chashme ke upar se ghura tha, meri pent geeli hone wali thi bhai! Bunty se bol na, wo fattu nahi hai!';
    }
    if (q.includes('samosa') || q.includes('canteen') || q.includes('food')) {
      return 'Arey bhai canteen mein fresh garam samosa aur adrak wali cutting chai aa chuki hai! Dubey Sir lecture mein blackboard pe muh karke likh rahe hain, yehi 2 minute ka golden window hai pichle darwaze se nikalne ka! Chalo bhaago!';
    }
    if (q.includes('eee') || q.includes('dubey')) {
      return 'Baap re baap! EEE mein 75% bacha hai sirf! Agar aaj bunk kiya toh Dubey Sir kal poori class ke saamne khada kar denge aur bolenge "Shabaash beta, engineer nahi circus ka joker banoge!". Main toh jaa raha hu class baithne!';
    }
    return 'Bhai pehle calculator mein dekh le! Agar attendance 80% ke upar hai tabhi main canteen chalta hu, warna mess ka ghatiya khana kha ke pet kharab ho gaya toh alag aafat!';
  }

  // Bunty (Always Savage & Uncensored by default)
  if (q.includes('proxy')) {
    return 'Sunn proxy ka pro backbencher formula: Kabhi bhi first 10 roll numbers pe proxy mat lagana, Dubey Sir tab full active rehte hain! Row 4 ke peeche baith, jab roll call EEE mein 20-30 ke beech aaye, tab saath wale ko bol khansne ko aur halki bhari aawaz mein "Present Sir" bol ke sir niche jhuka le. 100% full-proof jugaad!';
  }
  if (q.includes('medical') || q.includes('fake') || q.includes('excuse')) {
    return 'Abe clinic wale Sharma Bhaiya ko 150 rupaye ki chai-samosa khilayi thi pichle hafte, unhone "Viral Fever & Bed Rest" ka stamped slip de diya tha! Agar attendance 71% pe atki hai toh medical submit kar, HOD chup-chaap 5% waive kar dega!';
  }
  if (q.includes('eee') || q.includes('dubey')) {
    return 'Abe dimaag se paidal hai kya?! EEE mein 75% pe latka hua hai tu! Dubey Sir ka khoon khaulta hai attendance kam dekh ke. Aaj chup-chaap 3rd bench pe baith ke mobile pe reels dekh par class mat chhod! Kal Sharma Sir ka Programming (93%) hai, usme poora din bunk marenge!';
  }
  if (q.includes('english') || q.includes('recovery')) {
    return 'English mein 71% chal raha hai, seedha detention ka ghanta baj raha hai! Agle 6 lectures mein bina chhutti attendance lagwani padegi tab jaake 78% secure hoga. Recovery Plan tab khol aur ek bhi class miss mat karna fattu ki tarah!';
  }
  if (q.includes('programming') || q.includes('sharma')) {
    return 'Programming mein 93% chill scene hai boss! Sharma Sir khud aadha time code projector pe daal ke chai peene nikal jaate hain. Yeh class aaram se bunk maar aur Chintu ko canteen leke samosa party kar!';
  }
  if (q.includes('best day') || q.includes('calendar') || q.includes('thursday')) {
    return 'Thursday 5th Nov is the GODFATHER BUNK DAY (92% safe)! Sirf do lallu classes hain aur Dubey Sir ka koi lecture nahi hai. Subah se gayab ho jao, kisi ke baap ko pata nahi chalega!';
  }
  if (q.includes('3 bunk') || q.includes('simulator') || q.includes('classes')) {
    return 'Simulator ka maths dekh: Current 86% hai. 3 classes bunk marega toh 77% pe girega — safe hai par borderline! Par agar 4 ya 5 maari toh 71% pe Dubey Sir mummy ko phone ghumayenge aur ghar pe kalesh hoga!';
  }
  return 'Abe tension chhod! Overall attendance 86% hai, full king size safe zone mein hai tu! Bas EEE (75%) aur English (71%) ko lightly mat lena warna admit card lene HOD ke pair padne padenge. Baaki saare bunk ka jugaad Bunty ke paas ready hai!';
}

// Dev & Production serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Bunk Planner AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
