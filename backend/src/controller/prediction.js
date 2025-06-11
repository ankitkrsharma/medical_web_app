const { Prediction, LungScan, Patient } = require('../models');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

exports.getPredictionsByScanId = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const scanId = req.params.scanId;

    const lungScan = await LungScan.findOne({ where: { id: scanId, doctor_id: doctorId } });
    if (!lungScan) {
      return res.status(404).json({ message: 'Lung scan not found or not authorized' });
    }

    // Fetch all predictions for this scan
    const predictions = await Prediction.findAll({
      where: { scan_id: scanId },
      order: [['predicted_at', 'DESC']],
    });

    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllPredictionsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const predictions = await Prediction.findAll({
      include: [
        {
          model: LungScan,
          as: 'scan',
          where: { doctor_id: doctorId },
          include: [
            {
              model: Patient,
              as: 'patient',
              attributes: ['id', 'name', 'age', 'gender'],
            },
          ],
        },
      ],
      order: [['predicted_at', 'DESC']],
    });

    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.predictLungScan = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { scan_id } = req.body;

    const lungScan = await LungScan.findOne({
      where: { id: scan_id, doctor_id: doctorId }
    });

    if (!lungScan) {
      return res.status(404).json({ message: 'Lung scan not found or unauthorized' });
    }

    const imagePath = path.resolve(process.cwd(), lungScan.image_url.replace(/\\/g, '/'));

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image file not found on server' });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    const response = await axios.post('https://lungapi.onrender.com/predict/', form, {
      headers: { ...form.getHeaders() },
    });

    const { predicted_class, confidence } = response.data;

    const prediction = await Prediction.create({
      scan_id,
      prediction_result: predicted_class,
      confidence,
    });

    res.json({
      message: 'Prediction successful',
      prediction: {
        scan_id,
        predicted_class,
        confidence,
      },
    });

  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: 'Prediction failed', error: error.message });
  }
};




