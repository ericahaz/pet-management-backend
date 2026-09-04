const { SightingReport, User, Pet } = require('../models');
const { derivePriority, PRIORITY_RANK } = require('../utils/priority');

// Resident reports a sighting without needing to scan a QR code
// (used for yellow/red-tagged or unapproachable animals)
exports.createSightingReport = async (req, res) => {
  try {
    const { petId, temperamentObserved, locationLat, locationLng, photoUrl, description } = req.body;

    if (!['green', 'yellow', 'red'].includes(temperamentObserved)) {
      return res.status(400).json({ error: 'temperamentObserved must be green, yellow, or red' });
    }

    const report = await SightingReport.create({
      reporterId: req.user.id,
      petId: petId || null,
      temperamentObserved,
      locationLat, locationLng, photoUrl, description,
      priority: derivePriority(temperamentObserved),
      status: 'new'
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Officials/admin dashboard queue - sorted by priority (high first), then recency
exports.getSightingQueue = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    else where.status = ['new', 'forwarded_to_barangay'];

    const reports = await SightingReport.findAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'phone'] },
        { model: Pet, as: 'pet', attributes: ['id', 'name', 'species'] }
      ]
    });

    reports.sort((a, b) => {
      const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (rankDiff !== 0) return rankDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSightingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['new', 'forwarded_to_barangay', 'handled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const report = await SightingReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Sighting report not found' });

    report.status = status;
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
