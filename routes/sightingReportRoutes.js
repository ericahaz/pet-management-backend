const express = require('express');
const router = express.Router();
const sightingController = require('../controllers/sightingReportController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.post('/', requireAuth, sightingController.createSightingReport);

// Officials' priority queue
router.get(
  '/queue',
  requireAuth,
  requireRole('admin', 'barangay_official', 'volunteer'),
  sightingController.getSightingQueue
);

router.put(
  '/:id/status',
  requireAuth,
  requireRole('admin', 'barangay_official', 'volunteer'),
  sightingController.updateSightingStatus
);

module.exports = router;
