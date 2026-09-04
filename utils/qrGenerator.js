const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique QR identifier + a base64 QR image encoding
 * a public lookup URL for the pet.
 */
async function generatePetQr() {
  const qrId = uuidv4();
  const lookupUrl = `${process.env.PUBLIC_BASE_URL}/api/pets/lookup/${qrId}`;
  const qrImageDataUrl = await QRCode.toDataURL(lookupUrl);
  return { qrId, lookupUrl, qrImageDataUrl };
}

module.exports = { generatePetQr };
