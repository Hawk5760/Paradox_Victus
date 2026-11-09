# Uncensored & Savage Bunty & Chintu AI Persona Architecture

Transform Bunty and Chintu into authentically uncensored, savage Indian college backbenchers with witty hostel roasts, sneaky proxy hacks, realistic bunk tactics, and unfiltered comedic dialogue active by default across both AI chat and quick dialogue interactions.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following specifications were confirmed by the user in Phase 1 interactive clarification:
> - **Tone & Personality Style**: "All" — Bunty & Chintu will feature savage hostel slang, witty college roasts, daring proxy/bunk tricks, and raw backbencher humor without sterilized corporate filter talk.
> - **Activation Method**: **Always uncensored by default** across all chat messages and campus banter.
> - **Character Scope**: **Applied across both Bunty and Chintu** — Bunty acts as the overconfident, savage bunk mastermind who roasts strict rules and teaches real college escape jugads, while Chintu acts as the hilariously unfiltered, food-crazed sidekick terrified of Dubey Sir but full of chaotic hostel commentary.

---

## 1. Overview & Core Concept

- **What It Delivers**: Replaces sanitized, generic assistant phrasing with the real, hilarious voice of Indian engineering college backbenchers. Bunty delivers unapologetic calculations, savage roasts of boring lectures, witty excuses to fool attendance registers, and practical proxy/bunk advice. Chintu chimes in with unfiltered canteen cravings, dramatic panic over Dubey Sir's red pen, and chaotic hostel gossip.
- **Target Audience**: Indian college students who want a humorous, relatable, culturally authentic attendance companion rather than a sterile corporate chatbot.
- **Key Value**: Provides accurate mathematical calculations (attendance percentages, safe bunk limits, recovery timelines) wrapped in genuinely entertaining, culturally vibrant comedy.

---

## 2. User Experience & Visual Design

- **Default Uncensored Badge in Chat Header**:
  - The AI Assistant Modal will display an eye-catching **"🔥 Savage Hostel Mode: ACTIVE"** badge next to the character avatar, showing users that Bunty and Chintu are speaking without corporate filters.
- **Savage Quick Prompt Chips**:
  - Pre-baked questions in the chat modal will reflect authentic hostel dilemmas:
    - *"Bhai, Dubey Sir ko kaise bewakoof banayein?"*
    - *"EEE bunk karke canteen mein kya scene hai?"*
    - *"Proxy lagane ka best tarika bata!"*
    - *"71% attendance pe Dubey Sir se kaise bachein?"*
- **Comic Visual Accents**:
  - Fiery animated emojis (`🔥`, `🕶️`, `⚡`, `💀`) on savage responses.
  - Exaggerated comic reaction bubbles in `LandingHomeView`, `BunkPredictorView`, and `WhatIfSimulatorView` updated to reflect the new unfiltered banter.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: System Instruction Overhaul in Server (`server.ts`)**:
  - *Chosen Approach*: Rewrite Bunty and Chintu's system prompts to mandate raw, punchy Hinglish collegiate humor, slang (*"Baap re"*, *"Chuna lagana"*, *"Fattu"*, *"G*** phat gayi" contextually comic expressions, *"Jugaad"*, *"Bheja fry"*), fearless bunking advice, and unapologetic roasting of attendance policies while keeping mathematics 100% accurate.
  - *Why*: The server-side proxy controls all Gemini API calls and guarantees authentic tone without client-side tampering.
- **Decision 2: Updating Fallback Dialogues in `server.ts`**:
  - *Chosen Approach*: Upgrade `generateFallbackReply()` for both Bunty and Chintu so that even during offline or network-limited states, the responses remain consistently savage, hilarious, and uncensored.
  - *Why*: Ensures zero experience degradation regardless of network or API quotas.
- **Decision 3: Gemini Safety Settings Configuration**:
  - *Chosen Approach*: Explicitly configure Gemini safety thresholds in `@google/genai` request payload to prevent false-positive blocks on humorous colloquial slang and college banter.
  - *Why*: Standard safety filters frequently misclassify playful hostel slang (*"mar jaayenge"*, *"kutta bana denge"*) as violence; tuning thresholds allows full comedic freedom.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React Client)                   │
│                                                             │
│  ┌──────────────────────┐        ┌───────────────────────┐  │
│  │  AIAssistantModal    │        │  Campus Views         │  │
│  │  • "🔥 Savage Mode"  │        │  • Uncensored Banter  │  │
│  │  • Bunty / Chintu    │        │  • Live Speech Bubbles│  │
│  └──────────┬───────────┘        └───────────────────────┘  │
└─────────────┼───────────────────────────────────────────────┘
              │ POST /api/chat { persona, messages, studentContext }
              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Proxy (server.ts)                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ System Instruction Matrix:                             │  │
│  │ • Bunty: Mastermind, savage roaster, proxy tactician   │  │
│  │ • Chintu: Unfiltered canteen panic, samosa chronicles │  │
│  │ • Mathematical grounding (75% threshold, attendance)   │  │
│  └──────────────────────────┬────────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────┴────────────────────────────┐  │
│  │ GoogleGenAI SDK (@google/genai)                       │  │
│  │ • Model: gemini-3.8-flash (General)                   │  │
│  │ • Model: gemini-3.1-flash-lite (Fast)                 │  │
│  │ • Model: gemini-4-argon (Complex reasoning)           │  │
│  │ • Permissive colloquial comedy safety settings        │  │
│  └──────────────────────────┬────────────────────────────┘  │
│                             │ (Fallback when offline)       │
│                             ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Savage Fallback Matrix (generateFallbackReply)        │  │
│  │ • 100% savage hardcoded responses for all queries     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Verification Plan

1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` together to verify TypeScript and build health.
2. **AI Chat Response Verification**: Test `/api/chat` with Bunty and Chintu querying common bunking dilemmas, verifying raw hostel tone and proxy tactics.
3. **UI Visual Inspection**: Verify "Savage Hostel Mode" active indicators and updated prompt chips via Playwright CLI.
