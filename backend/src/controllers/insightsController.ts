import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';
import Subscription from '../models/Subscription';

export const getInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    // Fetch all user transactions
    const transactions = await Transaction.find({ userId, type: 'expense' });
    const subscriptions = await Subscription.find({ userId, status: 'active' });

    // 1. Anomaly Detection (Charges > 200% of average)
    const anomalies: any[] = [];
    if (transactions.length > 5) {
      const totalSpent = transactions.reduce((acc, tx) => acc + tx.amount, 0);
      const avgSpent = totalSpent / transactions.length;
      
      transactions.forEach(tx => {
        if (tx.amount > avgSpent * 2.5) {
          anomalies.push({
            id: tx._id,
            description: `Unusually high charge for ${tx.category || 'expense'}`,
            amount: tx.amount,
            date: tx.date
          });
        }
      });
    }

    // 2. Behavioral Insights (Weekend vs Weekday spending)
    let weekendSpent = 0;
    let weekdaySpent = 0;
    
    transactions.forEach(tx => {
      const day = new Date(tx.date).getDay();
      if (day === 0 || day === 6) {
        weekendSpent += tx.amount;
      } else {
        weekdaySpent += tx.amount;
      }
    });

    const insights = [];
    
    if (weekendSpent > weekdaySpent) {
      const diff = ((weekendSpent - weekdaySpent) / weekdaySpent) * 100;
      if (diff > 10) {
        insights.push({
          type: 'behavioral',
          title: 'Weekend Warrior',
          description: `You spend ${diff.toFixed(0)}% more on weekends compared to weekdays.`,
          icon: '🎉'
        });
      }
    }

    // 3. Subscription Optimization
    if (subscriptions.length > 0) {
      insights.push({
        type: 'optimization',
        title: 'Subscription Review',
        description: `You have ${subscriptions.length} active subscriptions. Review them to cut unnecessary costs.`,
        icon: '📅'
      });
    }

    // 4. Spending Velocity (Prediction)
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const currentDay = currentDate.getDate();
    
    const currentMonthTxs = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentDate.getMonth() && txDate.getFullYear() === currentDate.getFullYear();
    });

    const monthSpent = currentMonthTxs.reduce((acc, tx) => acc + tx.amount, 0);
    const dailyVelocity = monthSpent / currentDay;
    const predictedMonthEnd = dailyVelocity * daysInMonth;

    res.status(200).json({
      anomalies: anomalies.slice(0, 3), // Top 3
      insights,
      predictions: {
        currentMonthSpent: monthSpent,
        predictedEndMonth: predictedMonthEnd,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error generating insights', error });
  }
};
