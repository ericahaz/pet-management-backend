const { Pet, User } = require('../models');
const { generatePetQr } = require('../utils/qrGenerator');
const { calculateExpiryDate } = require('../utils/expiry');

// Owner registers a pet -> auto-generates QR code + expiry date
exports.registerPet = async (req, res) => {
  try {
    const { name, species, breed, color, age, photoUrl, temperament } = req.body;
    const ownerId = req.user.id;

    if (!name || !species) {
      return res.status(400).json({ error: 'Pet name and species are required' });
    }

    const { qrId, qrImageDataUrl } = await generatePetQr();
    const registrationDate = new Date();
    const expiryDate = calculateExpiryDate(registrationDate);

    const pet = await Pet.create({
      ownerId, name, species, breed, color, age, photoUrl,
      qrCode: qrId,
      registrationDate,
      expiryDate,
      temperament: temperament || 'green_friendly',
      status: 'active'
    });

    res.status(201).json({ pet, qrImage: qrImageDataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner renews an expiring/expired pet registration
exports.renewPet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    if (pet.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only renew your own pets' });
    }

    const newExpiry = calculateExpiryDate(new Date());
    pet.expiryDate = newExpiry;
    pet.status = 'active';
    await pet.save();

    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List the logged-in owner's pets
exports.getMyPets = async (req, res) => {
  const pets = await Pet.findAll({ where: { ownerId: req.user.id } });
  res.json(pets);
};

// Admin/official: list all pets, optional status filter
exports.getAllPets = async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;

  const pets = await Pet.findAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'phone'] }]
  });
  res.json(pets);
};

// Public QR lookup - no auth required, limited owner info only
exports.lookupPetByQr = async (req, res) => {
  try {
    const pet = await Pet.findOne({
      where: { qrCode: req.params.qrId },
      include: [{ model: User, as: 'owner', attributes: ['name', 'phone'] }]
    });

    if (!pet) return res.status(404).json({ error: 'No pet found for this QR code' });

    res.json({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      photoUrl: pet.photoUrl,
      temperament: pet.temperament,
      status: pet.status,
      owner: pet.owner
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Official/admin can correct a pet's temperament tag based on field reports
exports.updateTemperament = async (req, res) => {
  try {
    const { temperament } = req.body;
    const valid = ['green_friendly', 'yellow_caution', 'red_aggressive'];
    if (!valid.includes(temperament)) {
      return res.status(400).json({ error: 'Invalid temperament value' });
    }

    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    pet.temperament = temperament;
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
