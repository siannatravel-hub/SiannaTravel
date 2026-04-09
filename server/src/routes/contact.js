import { Router } from 'express';
import {
  submitContactForm,
  submitQuoteRequest,
  submitBookingRequest,
} from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  contactLimiter,
  validateBody(['name', 'email', 'message']),
  submitContactForm
);

router.post(
  '/quote',
  contactLimiter,
  validateBody(['name', 'email', 'packageId']),
  submitQuoteRequest
);

router.post(
  '/booking',
  contactLimiter,
  validateBody(['name', 'email', 'packageId', 'travelers']),
  submitBookingRequest
);

export default router;
