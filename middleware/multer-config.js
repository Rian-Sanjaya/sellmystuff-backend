const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// we create a storage constant — to be passed to multer as configuration — which contains the logic necessary for telling multer 
// where to save incoming files
// the destination function tells multer to save files in the images folder
// the filename function tells multer to use the original name, 
// replacing any spaces with underscores and adding a Date.now() timestamp, as the file name; 
// it then uses the MIME type map constant to resolve the appropriate file extension

// we then export the fully configured multer, passing it our storage constant, 
// and telling it that we will be handling uploads of single image files
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // to prevent a whitespace in the filename, we use split to replace the whitespace with underscore
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');