const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

// Public - anyone who scans a pet's QR tag can look it up, no login needed
router.get('/lookup/:qrId', petController.lookupPetByQr);

// Authenticated
router.post('/', requireAuth, petController.registerPet);
router.get('/mine', requireAuth, petController.getMyPets);
router.put('/:id/renew', requireAuth, petController.renewPet);

// Staff only
router.get('/', requireAuth, requireRole('admin', 'barangay_official', 'volunteer'), petController.getAllPets);
router.put('/:id/temperament', requireAuth, requireRole('admin', 'barangay_official'), petController.updateTemperament);

module.exports = router;
