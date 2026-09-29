# SWARTHIKA — AI-Powered Real-Time Stress & Vulnerability Assessment Platform

> **Smart India Hackathon 2026**  
> **Problem Statement ID:** `SIH26093`  
> **Team Name:** Swarthika  
> **Case ID Prefix:** `SW-`  
> **Project Type:** Frontend-Only Interactive Prototype (100% Browser-Based)

---

> [!IMPORTANT]
> **Prototype & Clinical Disclaimer:**  
> *"AI-assisted assessment — for decision support only. Human review required before any action."*  
> This is a frontend-only SIH 2026 prototype. Backend services, AI APIs, databases and emergency-service integrations are simulated using responsive client-side state engines. Never present this system as an autonomous medical or psychiatric diagnostic tool.

---

## 🌟 What is SWARTHIKA?

**SWARTHIKA** is a multi-modal, real-time stress, trauma, and vulnerability assessment platform designed to support front-line crisis counsellors and emergency triage desks. It empowers citizens to report situations via voice or text in multiple Indian languages while extracting acoustic dynamics and linguistic cues in real-time.

All assessed parameters are synthesized into an explainable **Stress Vulnerability Index (SVI)** (0–100 scale), categorized into calibrated risk tiers, and presented to human clinicians with actionable care pathways and full audit accountability.

---

## 🏛️ System Architecture & Key Modules

```
swarthika/
├── package.json               # Pure frontend dependencies (React 18, Vite, Zustand, Tailwind)
├── vite.config.ts             # Vite build & path alias config
├── tsconfig.json              # TypeScript strict configuration
├── tailwind.config.ts         # WCAG AA compliant color palette & typography
├── index.html                 # Google Inter & Devanagari typography
└── src/
    ├── main.tsx               # React 18 DOM root
    ├── App.tsx                # App wrapper with Navbar & Router
    ├── router.tsx             # React Router (Victim, Counsellor, Case, History, Demo)
    │
    ├── pages/
    │   ├── VictimPortal.tsx       # Multi-step citizen intake (Language -> Consent -> Mode -> Assessment -> Confirmation)
    │   ├── CounsellorDashboard.tsx # 30/70 split responsive clinician dashboard with live SVI gauge
    │   ├── CaseDetail.tsx         # Full deep-dive case dossier & JSON export
    │   ├── CaseHistory.tsx        # Searchable archive with client-side CSV export
    │   └── DemoMode.tsx           # Judge Demonstration Panel (4 test scenarios)
    │
    ├── components/
    │   ├── victim/            # LanguageSelector, ConsentScreen, VoiceRecorder, TextInput, AcousticVisualizer, SilentSOS
    │   ├── dashboard/         # SVIGauge, WhyThisScore, IndicatorList, RecommendationPanel, ActionButtons, CaseCard, SOSAlert, AuditLog, PrivacyPanel
    │   └── shared/            # Navbar, DisclaimerBanner, LanguageSwitcher, PrivacyStatus, LoadingSpinner
    │
    ├── store/
    │   ├── sessionStore.ts    # Zustand victim flow, acoustic metrics & SOS state
    │   ├── caseStore.ts       # Zustand case repository, filters, overrides & LocalStorage sync
    │   └── demoStore.ts       # Judge scenario playback & WebSocket simulation engine
    │
    ├── lib/
    │   ├── mockApi.ts         # Simulated async latency & LocalStorage persistence
    │   ├── mockWebSocket.ts   # Event streaming (TRANSCRIPT_UPDATE, ACOUSTIC_UPDATE, SVI_UPDATE)
    │   └── sviConfig.ts       # SVI formulas, weights (Acoustic 25%, Linguistic 30%, Emotion 25%, Vulnerability 20%)
    │
    ├── mock/
    │   ├── demoScenarios.ts   # 4 calibrated SIH judge demo scripts
    │   ├── mockCases.ts       # Preloaded cases (SW-1040 to SW-1048)
    │   └── mockAssessment.ts  # Heuristic NLP & acoustic screening
    │
    ├── types/                 # CaseRecord, SVIResult, ClinicalIndicator, SupportedLanguage
    └── i18n/                  # English (en), Hindi (hi), Marathi (mr) reactive dictionaries
```

---

## ⚡ Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler & Dev Server:** Vite 5
- **Styling:** Tailwind CSS (Deep Indigo, Teal, WCAG AA Risk Spectrum)
- **Icons:** Lucide React
- **State Management:** Zustand 5 (Reactive across tabs and flows)
- **Routing:** React Router v6
- **Speech Support:** Web Speech API (`webkitSpeechRecognition`) with zero-config synthetic fallbacks
- **Data Export:** Pure browser-generated CSV and JSON dossier downloads

---

## 🚀 Quick Start Guide

The application requires **zero external servers, zero API keys, zero Python, and zero databases**.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be running at `http://localhost:3000` (or the port assigned by Vite).

---

## 🧪 Judge Demonstration Mode (`/demo`)

The prototype includes a dedicated **Judge Demo Mode** designed for rapid evaluation:

| Scenario | Risk Level | Target SVI | Description / Simulated Input |
| :--- | :--- | :--- | :--- |
| **Scenario 1** | **LOW** | ~20 | *"Hello, I wanted to report something that happened to me. I'm okay now but I wanted to let someone know about it."* |
| **Scenario 2** | **MODERATE** | ~42 | *"I have been feeling very anxious lately. My neighbors have been saying things to me and I feel scared to go out."* |
| **Scenario 3** | **HIGH** | ~68 | *"They threatened me and my family. I am very afraid. They said if I go to the police they will do something worse."* |
| **Scenario 4** | **CRITICAL + SOS** | ~88 | *"I cannot take this anymore. My family was attacked and nobody helped us. I feel like there is no way out of this."* |

Clicking **"Run Simulation"** triggers:
1. Simulated WebSocket word-by-word streaming transcript
2. Live acoustic meter modulation (Pitch, Energy, Speech Rate, Pauses)
3. Dynamic SVI gauge rise from 0 to target score
4. Automatic case creation in the intake queue
5. Immediate elevation of **Silent SOS** to the top of the Counsellor Dashboard

---

## 🛡️ Core Assessment Vectors

### SVI Weight Formula (Prototype Standard)
- **Acoustic Signals (25%):** Vocal tremor, pitch instability, energy collapse, abnormal hesitation pauses.
- **Linguistic Analysis (30%):** Threat vocabulary, urgency markers, coercion keywords, and semantic distress.
- **Emotional & Trauma Load (25%):** Fear perception, panic markers, betrayal trauma, entrapment signals.
- **Situational Vulnerability (20%):** Social isolation, lack of support network, witness intimidation risks.

### 7 Clinical Indicators Monitored
1. **Fear & Threat Perception**
2. **Anxiety & Hyperarousal**
3. **Acute Trauma Markers**
4. **Social Isolation / Support Deficit**
5. **Coercion & Intimidation**
6. **Depressive Mood Markers**
7. **Suicidal Ideation / Crisis Screening**

---

## 🌐 Multilingual Support (i18n)

The victim intake portal features instant, zero-reload translation across:
- **English** (`en-IN`)
- **हिंदी (Hindi)** (`hi-IN`)
- **मराठी (Marathi)** (`mr-IN`)

Counsellor operations remain in English for standardization while preserving the original verbatim transcript and language tags.

---

## 🔒 Privacy & DPDP Act 2023 Compliance Design

- **Explicit Informed Consent:** User must agree before audio or text processing commences.
- **Human Counsellor Bypass:** Citizen can opt to speak directly to a human at step 2.
- **Discreet Silent SOS:** Safe emergency signal with non-alarming confirmation.
- **Zero Hardcoded Secrets:** All data is local, in-memory, or localStorage synchronized.
- **Audit Trail:** Every clinician override, peer review, and status update generates an immutable timestamped log.

---

*Developed for Smart India Hackathon 2026 — Problem Statement SIH26093 by Team Swarthika.*
