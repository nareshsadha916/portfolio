const db = require('./backend/config/db');
async function fix() {
  try {
    await db.query('UPDATE contact_info SET profile_image_url = NULL');
    console.log('Fixed profile image');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
