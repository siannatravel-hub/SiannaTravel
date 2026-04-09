import { Router } from 'express';
import {
  listPackages,
  getPackage,
  listFeatured,
  getFilters,
} from '../controllers/packageController.js';

const router = Router();

router.get('/', listPackages);
router.get('/featured', listFeatured);
router.get('/filters', getFilters);
router.get('/:id', getPackage);

export default router;
