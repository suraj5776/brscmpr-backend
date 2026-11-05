const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/db');
const apiRoutes = require('./routes/api');

// Load Environment Variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Server Healthcheck Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BRSC MPR Backend API is running successfully' });
});

// Initialize Database & Start Express Server
async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`BRSC-MPR Backend Server running on port ${PORT}`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Failed to start server due to database error:', error.message);
    process.exit(1);
  }
}

startServer();
