require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initSqlite } = require('./database/sqlite-wrapper');
const { initDatabase } = require('./database/init');
const symptomsRouter = require('./routes/symptoms');
const remediesRouter = require('./routes/remedies');
const yogaRouter = require('./routes/yoga');
const protocolRouter = require('./routes/protocol');
const doshaRouter = require('./routes/dosha');
const herbsRouter = require('./routes/herbs');
const assessmentRouter = require('./routes/assessment');
const chatRouter = require('./routes/chat');
const featuresRouter = require('./routes/features');
const { router: authRouter, initAuthTables } = require('./routes/auth');
const paymentRouter = require('./routes/payment');
const affiliateRouter = require('./routes/affiliate');
const searchRouter = require('./routes/search');
const { router: trackerRouter, initTrackerTables } = require('./routes/tracker');
const prakritiRouter = require('./routes/prakriti');
const achievementsRouter = require('./routes/achievements');
const seasonalDietRouter = require('./routes/seasonal-diet');
const timelineRouter = require('./routes/timeline');
const insightsRouter = require('./routes/insights');
const smartLogRouter = require('./routes/smart-log');

async function main() {
// Initialize sql.js (must be before any DB access)
await initSqlite();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Initialize AI (optional — works without it)
const { initAI } = require('./services/ai-chat');
initAI();

// Routes
app.use('/api/symptoms', symptomsRouter);
app.use('/api/remedies', remediesRouter);
app.use('/api/yoga', yogaRouter);
app.use('/api/protocol', protocolRouter);
app.use('/api/dosha', doshaRouter);
app.use('/api/herbs', herbsRouter);
app.use('/api/assessment', assessmentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/features', featuresRouter);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/affiliate', affiliateRouter);
app.use('/api/search', searchRouter);
app.use('/api/tracker', trackerRouter);
app.use('/api/prakriti', prakritiRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/seasonal-diet', seasonalDietRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/smart-log', smartLogRouter);

// Initialize auth tables
initAuthTables();
initTrackerTables();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'VedaHeal', version: '1.0.0' });
});

// Serve frontend static files (production mode)
const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌿 VedaHeal Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health\n`);
});

} // end main()

main().catch(err => {
  console.error('Failed to start:', err.message);
  process.exit(1);
});