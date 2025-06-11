const express = require('express');
const router = express.Router();
const patientController = require('../controller/patient');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, patientController.addPatient);
router.get('/', verifyToken, patientController.getPatients);

module.exports = router;
