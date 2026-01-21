require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors({
  origin: true, // Allow dynamic origin
  credentials: true // Izinkan cookie/session
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/proxy', require('./routes/proxy.routes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Serve Uploads Static Folder
app.use('/uploads', express.static('uploads'));

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', error);
    }
  });
};

const PORT = parseInt(process.env.PORT || 5000);
startServer(PORT);
