# ⚡ PRESSURE POINTS: The Truth About Student Life

> **An interactive digital safe haven, somatic decompression tool, and energy-managed day planner designed to uncover, validate, and relieve the chronic psychological pressures of modern university and college life.**

![Next.js 16](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.0-f43f5e?style=for-the-badge&logo=framer)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8b5cf6?style=for-the-badge&logo=google)

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Interactive Slide Deck (Chapters 01–09)](#-interactive-slide-deck-chapters-0109)
- [Pressure Companion (AI Chatbot & Day Planner)](#-pressure-companion-ai-chatbot--day-planner)
- [Emergency Student Helpline](#-emergency-student-helpline)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [License & Mental Health Disclaimer](#-license--mental-health-disclaimer)

---

## 🌟 Overview

Student life is often romanticized, yet behind closed dorm doors lies an invisible epidemic of chronic burnout, imposter syndrome, academic overload, and silent comparison dread.

**PRESSURE POINTS** replaces rigid, clinical advice with an authentic, empathetic experience structured as a sleek **slide-by-slide presentation deck**. It provides immediate somatic relief, intelligent task slicing, and an AI companion equipped with psychological grounding and energy-managed daily study schedules.

---

## 📑 Interactive Slide Deck (Chapters 01–09)

The platform presents a seamless, keyboard-navigable (`←` / `→` arrows, dock buttons) slide deck:

| Chapter | Module | Description |
| :--- | :--- | :--- |
| **01** | **The Diagnosis** | Dynamic hero highlighting the invisible epidemic of student burnout, high-stakes competition, and isolation. |
| **02** | **Persona Matrix** | 4 student archetypes (*The Invisible Striver, Parental Pressure Cooker, Scholarship Gambler, Overloaded Juggler*) with real-time reality checks and an interactive 1–5 Stress Dial. |
| **03** | **The Silent Burnout Curve** | Interactive multi-stage timeline visualizing the neurological shift from enthusiasm to chronic system freeze. |
| **04** | **The Comparison Trap** | Interactive reality-audit comparing curated LinkedIn/Instagram highlight reels against raw behind-the-scenes realities. |
| **05** | **Academic Pressure Cooker** | Data-backed examination of syllabus inflation, GPA hyper-fixation, and toxic productivity myths. |
| **06** | **The Cost of Isolation** | Unpacking pluralistic ignorance—why everyone assumes their peers are effortlessly succeeding while suffering in silence. |
| **07** | **7-Day Horizon & Work Slicer** | High-powered workload slicer featuring **Live Camera Scan** (`getUserMedia`), **Media/Screenshot Upload**, and **File Upload** (`FileReader`) to auto-slice assignments into a 7-day schedule with a real-time pressure bar graph. |
| **08** | **Somatic Reset Vault** | 5 guided regulation protocols: **Box Breathing (4-4-4-4)**, **4-7-8 Deep Sleep**, **Physiological Sigh (Stanford Huberman)**, **Resonant Flow (5.5s)**, and **5-4-3-2-1 Sensory Grounding**. |
| **09** | **Power Vault & Lifeline** | Decompression launchpad with instant access to the confidential Student Helpline modal. |

---

## 🤖 Pressure Companion (AI Chatbot & Day Planner)

Accessible via the floating button on every slide, **PRESSURE COMPANION** provides authentic peer support and practical anti-paralysis tools:

### 5 Specialized Modes:
1. **🥀 Raw Vent:** Hold space with zero unsolicited advice and zero toxic positivity. Validates student exhaustion unconditionally.
2. **⚡ Panic Grounding:** Immediate 3-minute somatic and cognitive triage for pre-exam dread or acute deadline paralysis.
3. **🔮 Thought Untangler:** Cognitive Behavioral (CBT) distortion reframing for imposter syndrome, catastrophizing, and highlight-reel comparison.
4. **⏳ Action Slicer:** Frictionless 5-minute micro-steps designed to dissolve cognitive freeze and procrastination.
5. **📅 Day Planner (New):**
   - Creates an **Energy-Managed Daily Study Blueprint** balancing deep cognitive focus with mandatory nervous system recovery.
   - Categorizes activities into color-coded time blocks:
     - ⚡ **Deep Focus** (High-yield cognitive sprints)
     - ☕ **Recovery Pause** (Screen-free vagus nerve resets)
     - 🕒 **Admin / Catchup** (Flashcards, readings, low-energy tasks)
     - 🛑 **Hard Shutdown** (Strict evening stop time for memory consolidation)
   - **1-Click Presets:** *4-Hour Sprint*, *Morning Reset*, and *Exam Day Pacer*.
   - **1-Click Copy:** Copies the formatted day plan directly to your clipboard for your notes or planner app.

### Dual Engine Architecture:
- **Cloud LLM Engine:** Powered by **Google Gemini 2.5 Flash** (`@google/genai`) with empathetic student-first system instructions.
- **Offline Knowledge Engine:** Built-in zero-key fallback with rich empathetic responses and schedule blueprints when offline or without an API key.
- **Safety Interceptor:** Immediate crisis detection with direct links to call or email free helplines.

---

## 🆘 Emergency Student Helpline

Integrated across the top navigation bar, the Power Vault, and the chatbot's crisis safety guard:

- 📞 **Phone:** [`9152987821`](tel:9152987821)
- ✉️ **Email:** [`icall@tiss.ac.in`](mailto:icall@tiss.ac.in)
- **Organization:** *iCALL Psychosocial Helpline (Tata Institute of Social Sciences)*
- **Service:** Free, confidential mental health counseling for students and young adults.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with HSL dark mode & glassmorphism
- **Animations:** [Framer Motion 14](https://www.framer.com/motion/) & [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API (real-time harmonic chimes and synthesizer frequencies)
- **AI / LLM:** Google Gen AI SDK (`@google/genai`) with Gemini 2.5 Flash

---

## 📁 Project Architecture

```text
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      # Gemini 2.5 Flash + offline fallback chat API
│   │   ├── globals.css            # Tailwind 4 theme, scanlines, glassmorphism
│   │   ├── layout.tsx             # Root layout with fonts & metadata
│   │   └── page.tsx               # 9-Chapter slide presentation deck controller
│   ├── components/
│   │   ├── BoxBreathingAnchor.tsx # 5 somatic breathwork & grounding protocols
│   │   ├── HelplineModal.tsx      # TISS iCALL helpline popup modal
│   │   ├── SevenDayHorizon.tsx    # Work slicer with Camera, Media & File uploads
│   │   ├── StudentChatBot.tsx     # Pressure Companion AI drawer & Day Planner
│   │   └── ...                    # Slide chapters (Diagnosis, Personas, etc.)
│   ├── data/
│   │   ├── chatKnowledgeBase.ts   # Presets, offline engine, crisis keywords
│   │   └── pressureData.ts        # Persona definitions, burnout data & statistics
│   ├── types/
│   │   ├── chat.ts                # ChatRole, ChatMode, ScheduleBlock, ChatMessage
│   │   └── index.ts               # Slide & Persona data contracts
│   └── utils/
│       └── audioSynth.ts          # Web Audio synth for soothing chimes & frequencies
├── .env.local                     # Optional GEMINI_API_KEY configuration
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.18+ or v20+
- **Package Manager:** `npm`, `pnpm`, or `yarn`

### 2. Clone and Install
```bash
git clone https://github.com/your-username/student-pressure.git
cd student-pressure
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔑 Environment Configuration

Create a `.env.local` file in the root directory (optional, but unlocks Gemini AI cloud responses):

```env
# Google Gemini API Key (Get free from https://aistudio.google.com/)
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> [!NOTE]
> If `GEMINI_API_KEY` is omitted, the application will automatically run the built-in **Offline Empathetic Knowledge Engine** with full Day Planner, CBT distortion busting, and somatic grounding capabilities.

---

## ⚖️ License & Mental Health Disclaimer

This project is open-source under the MIT License.

**Disclaimer:** *PRESSURE POINTS is a peer-support, educational, and somatic regulation platform. It is not a replacement for clinical psychiatric diagnosis or emergency psychiatric intervention. If you or someone you know is in immediate crisis, please reach out to your local emergency services or call the iCALL Helpline at `9152987821`.*
