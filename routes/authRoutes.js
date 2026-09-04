const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const db = require('../config/db'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getProfile);

module.exports = router;

// Password Reset Route
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  try {
    const bcrypt = require('bcrypt'); // Or 'bcryptjs' depending on your package.json
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ message: 'Database error occurred.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User with this email not found.' });
      }

      return res.status(200).json({ message: 'Password updated successfully!' });
    });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ message: 'Server error during password reset.' });
  }
});