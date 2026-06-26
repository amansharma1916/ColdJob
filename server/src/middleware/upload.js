import multer from 'multer';
import { ValidationError } from '../errors/ValidationError.js';
import { env } from '../config/env.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ValidationError([{ message: 'Only PDF files are allowed' }]), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: (env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024 },
  fileFilter,
});

export const uploadSingle = upload.single('resume');
export const uploadMultiple = upload.array('files', 5);