import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const listingId = req.params.listingId;

        if (!listingId) return cb(new Error('Missing listing ID'), null);

        const uploadPath = path.join('uploads', 'listings', listingId.toString());
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

export const upload = multer({ storage });
