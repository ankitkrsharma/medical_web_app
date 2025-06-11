
module.exports = (models) => {
    const { User, Patient, LungScan, Prediction } = models;


    // User (Doctor) has many Patients
    User.hasMany(Patient, {
        foreignKey: 'doctor_id',
        as: 'patients',
    });
    Patient.belongsTo(User, {
        foreignKey: 'doctor_id',
        as: 'doctor',
    });

    // Doctor has many LungScans
    User.hasMany(LungScan, {
        foreignKey: 'doctor_id',
        as: 'lungScans',
    });
    LungScan.belongsTo(User, {
        foreignKey: 'doctor_id',
        as: 'doctor',
    });

    // Patient has many LungScans
    Patient.hasMany(LungScan, {
        foreignKey: 'patient_id',
        as: 'lungScans',
    });
    LungScan.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
    });


    LungScan.hasOne(Prediction, {
        foreignKey: 'scan_id',
        as: 'prediction',  // singular
    });

    Prediction.belongsTo(LungScan, {
        foreignKey: 'scan_id',
        as: 'scan',
    });


}