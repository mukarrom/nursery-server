import { Request } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

// Supported file types
const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

const allowedVideoTypes = [
  'video/mp4',
  'video/quicktime', // MOV files
  'video/x-msvideo', // AVI
  'video/x-flv',
  'video/webm',
  'video/3gpp'
];

export const upload = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1000MB (adjust as needed)
    files: 15 // Allow up to 15 files (1 main image + up to 10 additional images + buffer)
  },
  fileFilter: (req: Request, file, cb) => {
    // Check for both image and video types
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only image (${allowedImageTypes.join(', ')}) and video (${allowedVideoTypes.join(', ')}) files are allowed`));
    }
  }
});

declare global {
  namespace Express {
    interface Multer {
      File: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
        size: number;
      };
    }
  }
}

// import multer from "multer";
// import { Request } from "express";

// const storage = multer.memoryStorage();

// export const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//     files: 1
//   },
//   fileFilter: (req: Request, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'));
//     }
//   }
// });

// declare global {
//   namespace Express {
//     interface Multer {
//       File: {
//         buffer: Buffer;
//         mimetype: string;
//         originalname: string;
//         size: number;
//       };
//     }
//   }
// }
