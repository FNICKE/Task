// server.js
import 'dotenv/config';           // modern one-liner (dotenv ≥16 + Node ≥20.6)

import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('──────────────────────────────────────────────');
    console.log(`🚀 Server running → http://localhost:${PORT}`);
    console.log(`Env: ${process.env.NODE_ENV || 'development'}`);
    console.log('──────────────────────────────────────────────');
});

// Optional graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM → shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT → shutting down');
    process.exit(0);
});