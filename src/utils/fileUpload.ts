import multer from 'multer';
import { join, extname } from 'path';
import fs from 'fs';
import { Request } from 'express';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = '';
        if (file.mimetype.startsWith('image/')) {
            dir = join(__dirname, '..', 'assets', 'uploads', 'images');
        } else if (file.mimetype.startsWith('video/')) {
            dir = join(__dirname, '..', 'assets', 'uploads', 'videos');
        }
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);

    },

})

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedMimeType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4']
    if (allowedMimeType.includes(file.mimetype)) {
        cb(null, true)
    }
    else { cb(new Error('Invalid file type')) }
}
const upload = multer({ storage, fileFilter });

export default upload;