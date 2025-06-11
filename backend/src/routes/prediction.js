const express = require('express');
const router = express.Router();
const controller = require('../controller/prediction');
const authMiddleware = require('../config/authorization');

router.get('/list', authMiddleware, controller.getAllPredictionsForDoctor);
router.get('/:scanId', authMiddleware, controller.getPredictionsByScanId);
router.post('/predict', authMiddleware, controller.predictLungScan);


module.exports = router;