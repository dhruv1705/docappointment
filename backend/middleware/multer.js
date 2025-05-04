import multer from "multer";
import path from "path";
import fs from "fs";

// Use /tmp directory for uploads in serverless environments
const uploadsDir = '/tmp/uploads';

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Successfully created directory: ${uploadsDir}`);
    } catch (error) {
      console.error(`Error creating directory ${uploadsDir}:`, error);
      // Optionally handle the error, e.g., by throwing it or logging
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the directory exists before attempting to save the file
        if (!fs.existsSync(uploadsDir)) {
          try {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log(`Re-created directory during request: ${uploadsDir}`);
          } catch (error) {
            console.error(`Error re-creating directory ${uploadsDir}:`, error);
            return cb(error); // Pass error to multer
          }
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;