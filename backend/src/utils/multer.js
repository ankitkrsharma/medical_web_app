const multer = require('multer');
const path = require('path');

// Define storage location and filename format
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/lung-scans'); // folder relative to your project root
  },
  filename: function (req, file, cb) {
    // Use timestamp + original name to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter to allow only images (jpg, png, jpeg)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, and png files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
