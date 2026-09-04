const { Pet, Report, SightingReport } = require('../models');
const { Op } = require('sequelize');

exports.getOverview = async (req, res) => {
  try {
    const [totalPets, activePets, expiredPets] = await Promise.all([
      Pet.count(),
      Pet.count({ where: { status: 'active' } }),
      Pet.count({ where: { status: 'expired' } })
    ]);

    const [pendingReports, resolvedReports] = await Promise.all([
      Report.count({ where: { status: ['pending', 'verified', 'in_progress'] } }),
      Report.count({ where: { status: 'resolved' } })
    ]);

    const [highPrioritySightings, openSightings] = await Promise.all([
      SightingReport.count({ where: { priority: 'high', status: ['new', 'forwarded_to_barangay'] } }),
      SightingReport.count({ where: { status: ['new', 'forwarded_to_barangay'] } })
    ]);

    const reportsByType = await Report.findAll({
      attributes: ['reportType', [Report.sequelize.fn('COUNT', '*'), 'count']],
      group: ['reportType']
    });

    res.json({
      pets: { total: totalPets, active: activePets, expired: expiredPets },
      reports: { pending: pendingReports, resolved: resolvedReports, byType: reportsByType },
      sightings: { highPriorityOpen: highPrioritySightings, totalOpen: openSightings }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
