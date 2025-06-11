const { Patient } = require('../models');
exports.addPatient = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { name, age, gender } = req.body;
    const patient = await Patient.create({ doctor_id: doctorId, name, age, gender });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const patients = await Patient.findAll({ where: { doctor_id: doctorId } });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};