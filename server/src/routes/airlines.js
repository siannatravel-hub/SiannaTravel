import { Router } from 'express';
import { search, listAirlines } from '../controllers/airlineController.js';

const router = Router();

router.get('/search', search);
router.get('/', listAirlines);

export default router;
