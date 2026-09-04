const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReportStatusLog = sequelize.define('ReportStatusLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reportId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  updatedBy: { type: DataTypes.INTEGER, allowNull: false },
  remarks: { type: DataTypes.TEXT }
}, {
  tableName: 'report_status_logs',
  updatedAt: false
});

module.exports = ReportStatusLog;
