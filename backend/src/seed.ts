import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';
import Transaction from './models/Transaction';
import Subscription from './models/Subscription';
import Goal from './models/Goal';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fintech_db';

const categories = ['Groceries', 'Dining', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Travel'];

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDaysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  return d;
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Subscription.deleteMany({});
    await Goal.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const user = await User.create({
      email: 'demo@fintrack.app',
      passwordHash,
      firstName: 'Stephen',
      lastName: 'Demo',
      themePreference: 'dark',
      baseCurrency: 'USD',
    });
    console.log(`👤 Created demo user: demo@fintrack.app / password123`);

    // Create transactions — 60 days of history
    const txDocs = [];

    // Income — twice a month
    for (let i = 0; i < 2; i++) {
      const d = new Date();
      d.setDate(i === 0 ? 1 : 15);
      txDocs.push({
        userId: user._id,
        amount: 3200,
        currency: 'USD',
        type: 'income',
        category: 'Salary',
        description: 'Monthly Salary',
        date: d,
        source: 'bank',
        isSubscription: false,
      });
    }

    // 50 random expense transactions
    for (let i = 0; i < 50; i++) {
      const isWeekend = Math.random() > 0.65; // more on weekends
      const date = randomDaysAgo(60);
      if (isWeekend) {
        const day = date.getDay();
        if (day !== 0 && day !== 6) date.setDate(date.getDate() + (6 - day));
      }
      const category = categories[Math.floor(Math.random() * categories.length)];
      const amount = category === 'Travel' ? randomBetween(80, 450) : randomBetween(5, 120);

      txDocs.push({
        userId: user._id,
        amount,
        currency: 'USD',
        type: 'expense',
        category,
        description: `${category} purchase`,
        date,
        source: Math.random() > 0.5 ? 'bank' : 'manual',
        isSubscription: false,
      });
    }

    // One anomalous charge (for anomaly detection to catch)
    txDocs.push({
      userId: user._id,
      amount: 980,
      currency: 'USD',
      type: 'expense',
      category: 'Shopping',
      description: 'Unexpected large purchase',
      date: randomDaysAgo(3),
      source: 'bank',
      isSubscription: false,
    });

    await Transaction.insertMany(txDocs);
    console.log(`💳 Created ${txDocs.length} transactions (including 1 anomaly)`);

    // Create subscriptions
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await Subscription.insertMany([
      { userId: user._id, name: 'Netflix', amount: 15.99, currency: 'USD', category: 'Streaming', billingCycle: 'monthly', nextBillingDate: nextMonth, status: 'active', isAutoDetected: true },
      { userId: user._id, name: 'Spotify', amount: 9.99, currency: 'USD', category: 'Music', billingCycle: 'monthly', nextBillingDate: nextMonth, status: 'active', isAutoDetected: true },
      { userId: user._id, name: 'GitHub Pro', amount: 4.00, currency: 'USD', category: 'SaaS', billingCycle: 'monthly', nextBillingDate: nextMonth, status: 'active', isAutoDetected: false },
      { userId: user._id, name: 'AWS', amount: 28.50, currency: 'USD', category: 'Cloud', billingCycle: 'monthly', nextBillingDate: nextMonth, status: 'active', isAutoDetected: true },
      { userId: user._id, name: 'Gym Membership', amount: 45.00, currency: 'USD', category: 'Lifestyle', billingCycle: 'monthly', nextBillingDate: nextMonth, status: 'active', isAutoDetected: false },
    ]);
    console.log('📅 Created 5 subscriptions');

    // Create savings goals
    await Goal.insertMany([
      { userId: user._id, name: 'Emergency Fund', targetAmount: 10000, currentAmount: 2500, currency: 'USD', status: 'in_progress' },
      { userId: user._id, name: 'Vacation to Bali', targetAmount: 3000, currentAmount: 1200, currency: 'USD', status: 'in_progress' },
      { userId: user._id, name: 'New Laptop', targetAmount: 2000, currentAmount: 800, currency: 'USD', status: 'in_progress' },
      { userId: user._id, name: 'College Fees', targetAmount: 15000, currentAmount: 4000, currency: 'ZMW', status: 'in_progress' },
    ]);
    console.log('🎯 Created 4 savings goals');

    console.log('\n✅ Seed complete!');
    console.log('📧 Login: demo@fintrack.app');
    console.log('🔑 Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
