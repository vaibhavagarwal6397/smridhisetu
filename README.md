# SamriddhiSetu (समृद्धि सेतु) — Smart India Hackathon (SIH 2026)

> **Voice-First, Offline-First 3D Progressive Web App (PWA) for Rural Indian Government Concessional Credit Routing**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS_v4-38B2AC?logo=tailwind-css)
![Three.js](https://img.shields.io/badge/3D-React_Three_Fiber_+_Drei-black?logo=three.js)
![Node.js](https://img.shields.io/badge/Backend-Node.js_+_Express-339933?logo=node.js)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101?logo=socket.io)
![AI](https://img.shields.io/badge/AI-Google_Gemini_3.6-4285F4?logo=google)

---

## 🌟 Overview

**SamriddhiSetu** addresses credit delivery friction for marginalized and rural communities (SC, ST, OBC, Safai Karamcharis, women, rural entrepreneurs) under schemes like **PM-AJAY**, **NSFDC**, **NBCFDC**, **NSKFDC**, and **PMEGP**.

By combining a **voice-first multi-turn intake**, an **interactive 3D holographic UI**, a **deterministic rules engine**, an **NPA-aware bank branch router**, and **DPDP Act privacy safeguards**, SamriddhiSetu routes beneficiaries to optimal schemes and high-liquidity bank branches in under 3 minutes.

---

## 🚀 Key Features

1. **🎤 Voice-First Conversational Intake**
   - Natural Hindi & English multi-turn conversational interview.
   - Powered by Web Speech API + Google Gemini for structured fact extraction.
   - Aggressive Voice Activity Detection (VAD) parameters optimized for rural acoustic noise.

2. **🌌 3D Holographic UI / Visual Experience**
   - Built with React Three Fiber (R3F), Drei, and custom GLSL particle fields.
   - Dynamic 3D Voice Orb responding to voice state (idle, listening, processing).
   - Interactive 3D wireframe Indian Globe with pulsating branch clusters.
   - 3D 6-Stage Application Pipeline tracker with bloom and glowing nodes.

3. **⚖️ Hybrid AI + Deterministic Rules Engine**
   - LLM extracts user facts (income, caste, age, state, purpose).
   - Pure deterministic math rules evaluate PM-AJAY, NSFDC, NBCFDC, NSKFDC, and PMEGP eligibility (100% auditable, no hallucinations).
   - Real-time financial calculations (EMI, interest subsidy, moratorium period).

4. **🏦 NPA-Aware Branch Routing**
   - Haversine distance-weighted routing algorithm:
     $$\text{Score} = 30\% \cdot \text{Distance} + 25\% \cdot \text{Scheme Match} + 20\% \cdot \text{Fund Avail.} + 15\% \cdot (1 - \text{NPA}) + 10\% \cdot (1 - \text{TAT})$$
   - Prevents rejected applications by routing away from liquidity-stressed bank branches.

5. **🔒 DPDP Act 2023 Compliance**
   - PII tokenization (Aadhaar, phone, PAN masked with synthetic tokens).
   - Ephemeral cache memory with automatic 5-minute TTL.

6. **⚡ Offline-First PWA**
   - Service worker with cache-first strategy for app shell and assets.
   - Offline fallback mock engine for zero-connectivity situations.

---

## 🛠️ Project Structure

```
SIH2026_DEMO/
├── client/                     # Frontend (React, Vite, R3F, Tailwind)
│   ├── public/                 # PWA manifest, service worker (sw.js)
│   └── src/
│       ├── components/
│       │   ├── 3d/             # ParticleField, FloatingGlobe, VoiceOrb, PipelineViz
│       │   └── ui/             # GlassCard, NavBar, StatusPill, AnimatedCounter
│       ├── pages/              # LandingPage, VoiceIntakePage, SchemeResultsPage, DashboardPage
│       ├── services/           # voiceService, apiService, mockData
│       └── store/              # Zustand global state (useStore.js)
│
├── server/                     # Backend (Node.js, Express, Socket.io)
│   └── src/
│       ├── data/               # Mock schemes & branches database
│       ├── engine/             # rulesEngine.js, financialCalculator.js, branchRouter.js
│       ├── routes/             # REST endpoints (/api/*)
│       ├── security/           # piiTokenizer.js (DPDP compliance)
│       └── services/           # geminiService.js, sanctionService.js
│
├── start.sh                    # One-command full-stack startup script
└── .gitignore                  # Git ignore for node_modules, .env, build artifacts
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm

### 2. Environment Setup
Create `server/.env`:
```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
# MONGODB_URI=mongodb+srv://... (optional)
```

### 3. Start Both Frontend & Backend
Run the all-in-one startup script:
```bash
chmod +x ./start.sh
./start.sh
```

Or run individually:
```bash
# Terminal 1: Backend
cd server
npm install
node src/index.js

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5001](http://localhost:5001)

---

## 📜 License
Developed for Smart India Hackathon (SIH 2026). MIT License.
