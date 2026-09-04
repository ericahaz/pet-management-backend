const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  species: { type: DataTypes.STRING, allowNull: false },
  breed: { type: DataTypes.STRING },
  color: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  photoUrl: { type: DataTypes.STRING },

  // QR identification
  qrCode: { type: DataTypes.STRING, allowNull: false, unique: true },

  // Expiry to keep the database from growing indefinitely with stale records
  registrationDate: { type: DataTypes.DATE, allowNull: false },
  expiryDate: { type: DataTypes.DATE, allowNull: false },

  // Color-coded temperament tag
  temperament: {
    type: DataTypes.ENUM('green_friendly', 'yellow_caution', 'red_aggressive'),
    allowNull: false,
    defaultValue: 'green_friendly'
  },

  status: {
    type: DataTypes.ENUM('active', 'expired', 'lost'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'pets'
});

module.exports = Pet;
