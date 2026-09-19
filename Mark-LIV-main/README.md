# JARVIS Mark-LIV Hybrid AI PC Assistant

Upgraded Hybrid PC Assistant bridging local Windows system automation with Google Gemini AI intelligence, offline resiliency, strict security confirmation, and structured action verification.

## 🏗️ Architecture Overview

```
USER VOICE / TEXT
        ↓
WAKE WORD / HOTKEY / INPUT
        ↓
  HYBRID ROUTER
        ↓
┌───────────────────────────────────────────────┐
│                                               │
│  LOCAL TASK        ONLINE TASK       AI CHAT  │
│  ──────────        ───────────       ───────  │
│  Windows Apps      Web Search        Gemini   │
│  Files / System    Weather / News    Analysis │
│  Volume / Mouse    Online APIs       Code Gen │
│                                               │
└───────────────────────────────────────────────┘
        ↓
  SECURITY CHECK (Safe / Confirmation / Strong)
        ↓
  EXECUTE ACTION (Isolated Action Handlers)
        ↓
  VERIFY RESULT (Structured Status & Message)
        ↓
  TEXT-TO-SPEECH / UI RESPONSE
```

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Windows 10/11 (for native Windows automation)
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Setup
```bash
# Clone or navigate to the project directory
cd Mark-LIV-main

# Copy environment template
cp .env.example .env

# Add your Gemini API key inside .env:
# GEMINI_API_KEY=your_actual_key_here

# Install required dependencies
pip install -r requirements.txt
```

### 3. Running JARVIS
```bash
python main.py
```
