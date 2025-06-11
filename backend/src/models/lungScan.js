module.exports = (sequelize, DataTypes) => {
  const LungScan = sequelize.define('LungScan', {
    id: {
      type: DataTypes.INTEGER,
        autoIncrement: true,
      primaryKey: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'lung_scans',
    timestamps: false,
    underscored: true,
  });

  return LungScan;
};
