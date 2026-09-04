const { User } = require('../models');

// Admin: list all registered users
exports.getAllUsers = async (req, res) => {
  try {
    const where = {};
    if (req.query.role) where.role = req.query.role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: change a user's role (e.g. promote a resident to barangay_official)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['resident', 'pet_owner', 'barangay_official', 'admin', 'volunteer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role value' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    const { passwordHash, ...safeUser } = user.toJSON();
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
