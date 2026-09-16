import express from 'express';
import { checkEligibility, getLeads, deleteLead, bulkDeleteLeads, resendLeadEmail, exportCsv } from '../controllers/leadController.js';
import { validateLeadSubmission } from '../validators/leadValidator.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Route
router.post('/check-eligibility', validateLeadSubmission, checkEligibility);

// Protected Admin Routes
router.get('/', protectAdmin, getLeads);
router.get('/export/csv', protectAdmin, exportCsv);
router.post('/bulk-delete', protectAdmin, bulkDeleteLeads);
router.post('/:id/resend-email', protectAdmin, resendLeadEmail);
router.delete('/:id', protectAdmin, deleteLead);

export default router;
