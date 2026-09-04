const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.post('/', requireAuth, reportController.createReport);
router.get('/', requireAuth, reportController.getReports);
router.get('/:id', requireAuth, reportController.getReportById);

// Only staff can move a report through its status pipeline
router.put(
  '/:id/status',
  requireAuth,
  requireRole('admin', 'barangay_official', 'volunteer'),
  reportController.updateReportStatus
);

module.exports = router;
