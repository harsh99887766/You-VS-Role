import express from 'express';
import multer from 'multer';
import { analyzeCandidate } from '../controllers/analysisController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), analyzeCandidate);

export default router;
