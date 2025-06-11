const express = require('express');
const router = express.Router();
const lungScanController = require('../controller/lungScan');
const authMiddleware = require('../config/authorization');
const upload = require('../utils/multer');
router.post('/', authMiddleware, upload.single('image'), lungScanController.uploadLungScan);

router.get('/', authMiddleware, lungScanController.getAllLungScans);

module.exports = router;
