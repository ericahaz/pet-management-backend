require('dotenv').config();
const cron = require('node-cron');
const app = require('./app');
const { sequelize } = require('./models');
const { markExpiredPets } = require('./utils/expiry');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // In production, use migrations instead of sync({ alter: true })
    await sequelize.sync({ alter: true });
    console.log('Models synced.');

    // Daily job at midnight: flag pets past their expiry date
    cron.schedule('0 0 * * *', async () => {
      const count = await markExpiredPets();
      console.log(`Expiry check: ${count} pet(s) marked expired.`);
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
