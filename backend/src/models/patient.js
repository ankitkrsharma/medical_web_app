module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE', // ✅ Delete all patients if doctor is deleted
      onUpdate: 'CASCADE'
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
      allowNull: false,
    },
  }, {
    tableName: 'patients',
    timestamps: true,
    underscored: true,
  });

  return Patient;
};
