const multer = require('multer');
const path = require('path');
const fs = require('fs')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image' || file.fieldname === 'profilePicture') {
            cb(null, uploadsDir); 
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'image' || file.fieldname === 'profilePicture') {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for image'), false);
        }
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 } // Limit file size to 50MB
});

module.exports = upload;