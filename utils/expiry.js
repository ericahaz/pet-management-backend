const { Op } = require('sequelize');
const { Pet } = require('../models');

function calculateExpiryDate(fromDate = new Date()) {
  const years = parseInt(process.env.PET_REGISTRATION_VALIDITY_YEARS || '1', 10);
  const expiry = new Date(fromDate);
  expiry.setFullYear(expiry.getFullYear() + years);
  return expiry;
}

// Flags any active pet past its expiry date as 'expired'.
// Call this on a schedule (see server.js node-cron setup) or on-demand.
async function markExpiredPets() {
  const [count] = await Pet.update(
    { status: 'expired' },
    { where: { expiryDate: { [Op.lt]: new Date() }, status: 'active' } }
  );
  return count;
}

module.exports = { calculateExpiryDate, markExpiredPets };
