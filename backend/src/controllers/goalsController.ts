import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Goal from '../models/Goal';

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goals = await Goal.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

export const addGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, targetAmount, currentAmount, currency, targetDate, status } = req.body;
    
    const goal = new Goal({
      userId: req.user?.userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      currency,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      status: status || 'in_progress'
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error adding goal', error });
  }
};

export const updateGoalProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amountToAdd } = req.body;

    const goal = await Goal.findOne({ _id: id, userId: req.user?.userId });
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    goal.currentAmount += amountToAdd;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error });
  }
};
