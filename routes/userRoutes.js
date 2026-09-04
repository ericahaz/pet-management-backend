const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.get('/', requireAuth, requireRole('admin'), userController.getAllUsers);
router.put('/:id/role', requireAuth, requireRole('admin'), userController.updateUserRole);

module.exports = router;
