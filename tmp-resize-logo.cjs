const sharp = require('sharp');

sharp('public/images/atlaslogo.png')
  .resize(120)
  .toFile('public/images/atlaslogo.png')
  .then(() => console.log('done'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
