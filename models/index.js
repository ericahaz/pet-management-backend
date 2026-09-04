const sequelize = require('../config/database');
const User = require('./User');
const Pet = require('./Pet');
const Report = require('./Report');
const ReportStatusLog = require('./ReportStatusLog');
const SightingReport = require('./SightingReport');

// User <-> Pet
User.hasMany(Pet, { foreignKey: 'ownerId', as: 'pets' });
Pet.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User <-> Report
User.hasMany(Report, { foreignKey: 'reporterId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
Report.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });

// Pet <-> Report
Pet.hasMany(Report, { foreignKey: 'petId', as: 'reports' });
Report.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

// Report <-> ReportStatusLog
Report.hasMany(ReportStatusLog, { foreignKey: 'reportId', as: 'statusLogs' });
ReportStatusLog.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });
ReportStatusLog.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });

// User <-> SightingReport
User.hasMany(SightingReport, { foreignKey: 'reporterId', as: 'sightingReports' });
SightingReport.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

// Pet <-> SightingReport
Pet.hasMany(SightingReport, { foreignKey: 'petId', as: 'sightingReports' });
SightingReport.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

module.exports = {
  sequelize,
  User,
  Pet,
  Report,
  ReportStatusLog,
  SightingReport
};
