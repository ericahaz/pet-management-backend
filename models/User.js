const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  role: {
    type: DataTypes.ENUM('resident', 'pet_owner', 'barangay_official', 'admin', 'volunteer'),
    allowNull: false,
    defaultValue: 'resident'
  }
}, {
  tableName: 'users'
});

module.exports = User;
