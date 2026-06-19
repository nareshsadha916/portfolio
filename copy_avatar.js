const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'backend', 'uploads', 'profile_image-1781249080935-641702789.png');
const dest = path.join(__dirname, 'frontend', 'public', 'avatar.png');
fs.copyFileSync(src, dest);
console.log('Photo copied successfully!');
