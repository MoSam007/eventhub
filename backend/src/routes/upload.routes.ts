import { Router } from 'express';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload event images (returns data URLs for now)
router.post(
  '/event-images',
  upload.array('images'),
  (req, res) => {
    const files = (((req as any).files) || []) as Array<{ mimetype: string; buffer: Buffer }>;
    const urls = files.map((file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
    res.status(200).json({ status: 'success', data: { urls } });
  }
);

export default router;
