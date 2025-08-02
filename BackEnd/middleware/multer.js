import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import path from 'path';

// 1. Storage per avatar
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatar',
    format: async (req, file) => path.extname(file.originalname).slice(1),
    public_id: (req, file) => {
      const timestamp = Date.now();
      const baseName = path.parse(file.originalname).name;
      return `author_${baseName}_${timestamp}`;
    }
  }
});

// 2. Storage per cover
const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cover',
    format: async (req, file) => path.extname(file.originalname).slice(1),
    public_id: (req, file) => {
      const timestamp = Date.now();
      const baseName = path.parse(file.originalname).name;
      return `cover_${baseName}_${timestamp}`;
    }
  }
});

// Filtro MIME valido per entrambi
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/heic',
    'image/heif'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Formato file non supportato. Accettiamo solo jpg, jpeg, png e pdf.'), false);
  }
};

// Middleware multer per avatar
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Middleware multer per cover
const uploadCover = multer({
  storage: coverStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

export { uploadAvatar, uploadCover };