import { Router } from 'express';
import { getSubscriptions, addSubscription, deleteSubscription } from '../controllers/subscriptionsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getSubscriptions);
router.post('/', addSubscription);
router.delete('/:id', deleteSubscription);

export default router;
