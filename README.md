# 🌿 VedaHeal — Ayurvedic Wellness App

India's most comprehensive Ayurvedic wellness platform. 798 herbs, 45 health problems, AI chatbot, personalized healing protocols.

## Quick Deploy (Free — 10 minutes)

### Option 1: Render.com (Recommended — completely free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → Sign up with GitHub
3. New → Web Service → Connect your repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variable: `GROQ_API_KEY` = your key from [console.groq.com](https://console.groq.com)
6. Deploy → Your app is live at `https://vedaheal.onrender.com`

### Option 2: Railway.app (Free 500hrs/month)

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. New Project → Deploy from GitHub → Select repo
3. Set root to `backend`
4. Add env: `GROQ_API_KEY`
5. Deploy

## Local Development

```bash
cd backend
npm install
npm start
# Open http://localhost:5000
```

## Revenue Streams

1. **Google AdSense** — Uncomment the script tag in `frontend/index.html`, add your publisher ID
2. **Affiliate Links** — Update Amazon tag in `backend/src/routes/affiliate.js`
3. **Premium Subscriptions** — Razorpay integration ready in `backend/src/routes/payment.js`
4. **Herb Box Subscription** — Partner with suppliers

## Tech Stack

- Backend: Node.js + Express + SQLite (sql.js)
- Frontend: React + Vite (pre-built, served by backend)
- AI: Groq (Llama 3.3 70B) — free tier
- Database: 798 herbs from Amidha Ayurveda (CC BY 4.0)

## Features

- 💬 AI Chatbot (Ayurvedic wellness guide)
- 🌿 798 Herb Encyclopedia
- 🤒 45 Health Problems + 210 Remedies
- 🧘 43 Yoga Exercises
- 📊 Health Tracker + AI Insights Engine
- 🔮 10 Wellness Tools (Tongue diagnosis, Pulse reading, Moon phase, etc.)
- 🍽️ Seasonal Diet Generator
- 💊 Herb Interaction Checker
- 🛒 Shop with Affiliate Links
- 👤 User Accounts + Premium Plans
- 🌙 Dark Mode
- 🌐 Hindi/English
