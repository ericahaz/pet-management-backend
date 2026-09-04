const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.get(
  '/overview',
  requireAuth,
  requireRole('admin', 'barangay_official'),
  dashboardController.getOverview
);

module.exports = router;
