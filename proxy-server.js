const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/html', limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// V2 Auth Endpoint
app.post('/proxy/bee-auth', async (req, res) => {
  try {
    const { uid } = req.body;
    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      {
        client_id: process.env.BEE_CLIENT_ID,
        client_secret: process.env.BEE_CLIENT_SECRET,
        uid: uid || 'demo-user'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

// Health Check
app.get('/proxy/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

// Error Handling
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});