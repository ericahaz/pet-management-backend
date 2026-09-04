const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SightingReport = sequelize.define('SightingReport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reporterId: { type: DataTypes.INTEGER, allowNull: false },
  petId: { type: DataTypes.INTEGER, allowNull: true }, // nullable: unknown/unregistered animal

  temperamentObserved: {
    type: DataTypes.ENUM('green', 'yellow', 'red'),
    allowNull: false
  },
  locationLat: { type: DataTypes.DECIMAL(10, 7) },
  locationLng: { type: DataTypes.DECIMAL(10, 7) },
  photoUrl: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT },

  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'low'
  },
  status: {
    type: DataTypes.ENUM('new', 'forwarded_to_barangay', 'handled'),
    allowNull: false,
    defaultValue: 'new'
  }
}, {
  tableName: 'sighting_reports'
});

module.exports = SightingReport;
