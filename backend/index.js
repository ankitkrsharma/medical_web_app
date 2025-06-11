const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const patientRoutes = require('./src/routes/patient');
const lungScanRoutes = require('./src/routes/lungScan');
const predictionRoutes = require('./src/routes/prediction');  // ✅ Renamed to /api/predict
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/lung-scans', lungScanRoutes);
app.use('/api/predict', predictionRoutes);  // ✅ Changed from '/api/predictions' to '/api/predict'

// Health Check Route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('✅ DB Connected');
    return sequelize.sync();
  })
  .then(() => {
    console.log('📡 Starting server...');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });
