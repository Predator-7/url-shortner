import express from 'express';
import URLController from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorten', URLController.shorten);
router.get('/stats/:shortCode', URLController.getStats);
router.get('/:shortCode', URLController.redirect);

export default router;
