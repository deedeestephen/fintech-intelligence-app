import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find({ userId: req.user?.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

export const addTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency, type, category, description, source, date, isSubscription } = req.body;
    
    const transaction = new Transaction({
      userId: req.user?.userId,
      amount,
      currency,
      type,
      category,
      description,
      source,
      date: date || new Date(),
      isSubscription
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
};

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    // Aggregate income and expenses
    const summary = await Transaction.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$type', totalAmount: { $sum: '$amount' } } }
    ]);

    let income = 0;
    let expenses = 0;

    summary.forEach(item => {
      if (item._id === 'income') income = item.totalAmount;
      if (item._id === 'expense') expenses = item.totalAmount;
    });

    res.status(200).json({
      netWorth: income - expenses,
      income,
      expenses,
      healthScore: income > expenses ? 85 : 45
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard summary', error });
  }
};
