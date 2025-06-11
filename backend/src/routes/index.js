const authRoutes = require('./auth');
const patientRoutes = require('./patient');    
const lungScanRoutes = require('./lungScan');
const predictionRoutes = require('./prediction');

const initializeRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/patients', patientRoutes);      
    app.use('/api/lung-scans', lungScanRoutes);
    app.use('/api/predictions', predictionRoutes);
};

module.exports = initializeRoutes;
