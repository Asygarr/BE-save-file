// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

export class MulterConfig {
  static storage = diskStorage({
    destination: (req, file, cb) => {
      const dirr = './public/uploads';
      if (!fs.existsSync(dirr)) {
        fs.mkdirSync(dirr, { recursive: true });
      }

      cb(null, dirr);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  });
}
