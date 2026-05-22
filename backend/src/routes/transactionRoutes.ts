import { Router } from 'express';
import { getTransactions, addTransaction, getDashboardSummary } from '../controllers/transactionsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getTransactions);
router.post('/', addTransaction);
router.get('/summary', getDashboardSummary);

export default router;
