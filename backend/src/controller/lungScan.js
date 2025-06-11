const { LungScan, Patient } = require('../models');

exports.uploadLungScan = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patient_id } = req.body;

    const patient = await Patient.findOne({ where: { id: patient_id, doctor_id: doctorId } });
    if (!patient) return res.status(404).json({ message: 'Patient not found or not assigned to you' });

    // File path saved by multer
const image_url = req.file ? req.file.path : null;
if (!image_url) return res.status(400).json({ message: 'Image file is required' });


    const lungScan = await LungScan.create({
      patient_id,
      doctor_id: doctorId,
      image_url,
      uploaded_at: new Date(),
    });

    res.status(201).json(lungScan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllLungScans = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const lungScans = await LungScan.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name', 'age', 'gender'],
        },
      ],
      order: [['uploaded_at', 'DESC']],
    });

    res.json(lungScans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
