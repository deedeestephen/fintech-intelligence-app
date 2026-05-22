import { Router } from 'express';
import { getGoals, addGoal, updateGoalProgress } from '../controllers/goalsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getGoals);
router.post('/', addGoal);
router.put('/:id/progress', updateGoalProgress);

export default router;
