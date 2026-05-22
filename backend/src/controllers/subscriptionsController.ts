import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Subscription from '../models/Subscription';

export const getSubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user?.userId }).sort({ nextBillingDate: 1 });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error });
  }
};

export const addSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, amount, currency, category, billingCycle, nextBillingDate, source, isAutoDetected } = req.body;
    
    const subscription = new Subscription({
      userId: req.user?.userId,
      name,
      amount,
      currency,
      category,
      billingCycle,
      nextBillingDate: new Date(nextBillingDate),
      source,
      isAutoDetected: isAutoDetected || false
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error adding subscription', error });
  }
};

export const deleteSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Subscription.findOneAndDelete({ _id: id, userId: req.user?.userId });
    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscription', error });
  }
};
