const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reporterId: { type: DataTypes.INTEGER, allowNull: false },
  petId: { type: DataTypes.INTEGER, allowNull: true }, // matched registered pet, if any

  reportType: {
    type: DataTypes.ENUM('stray', 'lost', 'found'),
    allowNull: false
  },
  animalType: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  photoUrl: { type: DataTypes.STRING },

  locationLat: { type: DataTypes.DECIMAL(10, 7) },
  locationLng: { type: DataTypes.DECIMAL(10, 7) },
  locationText: { type: DataTypes.STRING },

  status: {
    type: DataTypes.ENUM('pending', 'verified', 'in_progress', 'resolved', 'closed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  reviewedBy: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'reports'
});

module.exports = Report;
