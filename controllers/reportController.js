const { Report, ReportStatusLog, User, Pet } = require('../models');

// Resident/pet owner submits a stray, lost, or found report
exports.createReport = async (req, res) => {
  try {
    const {
      petId, reportType, animalType, description,
      photoUrl, locationLat, locationLng, locationText
    } = req.body;

    if (!reportType || !['stray', 'lost', 'found'].includes(reportType)) {
      return res.status(400).json({ error: 'reportType must be stray, lost, or found' });
    }

    const report = await Report.create({
      reporterId: req.user.id,
      petId: petId || null,
      reportType, animalType, description, photoUrl,
      locationLat, locationLng, locationText,
      status: 'pending'
    });

    await ReportStatusLog.create({
      reportId: report.id,
      status: 'pending',
      updatedBy: req.user.id,
      remarks: 'Report submitted'
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List reports - filterable by type/status; officials/admin see everything, residents see their own
exports.getReports = async (req, res) => {
  try {
    const where = {};
    if (req.query.reportType) where.reportType = req.query.reportType;
    if (req.query.status) where.status = req.query.status;

    const isStaff = ['admin', 'barangay_official', 'volunteer'].includes(req.user.role);
    if (!isStaff) where.reporterId = req.user.id;

    const reports = await Report.findAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'phone'] },
        { model: Pet, as: 'pet', attributes: ['id', 'name', 'species', 'photoUrl'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReportById = async (req, res) => {
  const report = await Report.findByPk(req.params.id, {
    include: [
      { model: User, as: 'reporter', attributes: ['id', 'name', 'phone'] },
      { model: Pet, as: 'pet' },
      { model: ReportStatusLog, as: 'statusLogs', order: [['createdAt', 'ASC']] }
    ]
  });
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
};

// Officials/admin update report status - Report Management + Location/Tracking Modules
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const valid = ['pending', 'verified', 'in_progress', 'resolved', 'closed'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    report.status = status;
    report.reviewedBy = req.user.id;
    await report.save();

    await ReportStatusLog.create({
      reportId: report.id,
      status,
      updatedBy: req.user.id,
      remarks: remarks || null
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
