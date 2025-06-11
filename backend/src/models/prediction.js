module.exports = (sequelize, DataTypes) => {
  const Prediction = sequelize.define('Prediction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    scan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lung_scans',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    prediction_result: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    predicted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'predictions',
    timestamps: false,
    underscored: true,
  });

  return Prediction;
};
