import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import InsightCard from '../../components/InsightCard';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState({ netWorth: 0, income: 0, expenses: 0, healthScore: 0 });
  const [transactions, setTransactions] = useState([]);
  const [insightsData, setInsightsData] = useState({ anomalies: [], insights: [], predictions: null });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await api.get('/transactions/summary');
      const txRes = await api.get('/transactions');
      const insightsRes = await api.get('/insights').catch(() => ({ data: null })); // Don't fail entire dashboard if insights fail
      
      if (summaryRes.data) setSummary(summaryRes.data);
      if (txRes.data) setTransactions(txRes.data.slice(0, 3)); // Only get top 3
      if (insightsRes.data) setInsightsData(insightsRes.data);
      
    } catch (error) {
      console.warn('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-fintech-background dark:bg-fintech-background justify-center items-center">
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  const hasInsights = insightsData.anomalies.length > 0 || insightsData.insights.length > 0;

  return (
    <ScrollView 
      className="flex-1 bg-fintech-background dark:bg-fintech-background p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F0FF" />}
    >
      <View className="mb-6 mt-8 flex-row justify-between items-center">
        <View>
          <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-sm">Welcome back,</Text>
          <Text className="text-2xl font-bold text-fintech-text dark:text-fintech-text">
            {user?.firstName || 'User'}
          </Text>
        </View>
        <TouchableOpacity className="w-10 h-10 bg-fintech-surface dark:bg-fintech-surface rounded-full items-center justify-center">
          <Text className="text-fintech-primary text-lg">🔔</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-fintech-primary p-6 rounded-3xl mb-6 shadow-lg shadow-fintech-primary/40">
        <Text className="text-fintech-background text-sm mb-1 font-medium">Total Net Worth</Text>
        <Text className="text-fintech-background text-4xl font-bold">${summary.netWorth?.toFixed(2)}</Text>
        <View className="flex-row justify-between mt-4">
          <View>
            <Text className="text-fintech-background/80 text-xs">Income</Text>
            <Text className="text-fintech-background font-bold">+ ${summary.income?.toFixed(2)}</Text>
          </View>
          <View>
            <Text className="text-fintech-background/80 text-xs">Expenses</Text>
            <Text className="text-fintech-background font-bold">- ${summary.expenses?.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {hasInsights && (
        <View className="mb-6">
          <Text className="text-lg font-bold text-fintech-text dark:text-fintech-text mb-3">Smart Intelligence</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            {insightsData.anomalies.map((anomaly: any, i) => (
              <InsightCard key={`anom-${i}`} insight={anomaly} isAnomaly={true} />
            ))}
            {insightsData.insights.map((insight: any, i) => (
              <InsightCard key={`ins-${i}`} insight={insight} />
            ))}
          </ScrollView>
        </View>
      )}

      {insightsData.predictions && (
        <View className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-6 flex-row items-center justify-between shadow-sm border-l-4 border-l-fintech-secondary">
          <View>
            <Text className="text-fintech-text dark:text-fintech-text font-bold text-base">End of Month Forecast</Text>
            <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs mt-1">Based on current velocity</Text>
          </View>
          <View className="items-end">
            <Text className="text-fintech-secondary font-bold text-lg">${insightsData.predictions.predictedEndMonth?.toFixed(0)}</Text>
            <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-[10px]">Predicted Expenses</Text>
          </View>
        </View>
      )}

      <Text className="text-lg font-bold text-fintech-text dark:text-fintech-text mb-4">Financial Health</Text>
      <View className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-6 flex-row items-center justify-between shadow-sm">
        <View>
          <Text className="text-fintech-text dark:text-fintech-text font-bold text-lg">Good Standing</Text>
          <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs mt-1">Based on recent activity</Text>
        </View>
        <View className="bg-fintech-success/20 px-3 py-2 rounded-lg">
          <Text className="text-fintech-success font-bold">{summary.healthScore || 0} / 100</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-4 items-end">
        <Text className="text-lg font-bold text-fintech-text dark:text-fintech-text">Recent Transactions</Text>
        <TouchableOpacity>
          <Text className="text-fintech-primary text-sm font-medium">See All</Text>
        </TouchableOpacity>
      </View>
      
      {transactions.length === 0 ? (
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-center my-4">No recent transactions</Text>
      ) : (
        transactions.map((tx: any, i: number) => (
          <View key={tx._id || i} className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-fintech-primary/10 items-center justify-center mr-4">
                <Text>{tx.type === 'income' ? '💰' : '🛒'}</Text>
              </View>
              <View>
                <Text className="text-fintech-text dark:text-fintech-text font-bold">{tx.category || tx.description || 'Unknown'}</Text>
                <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs">{new Date(tx.date).toLocaleDateString()}</Text>
              </View>
            </View>
            <Text className={`font-bold ${tx.type === 'income' ? 'text-fintech-success' : 'text-fintech-text dark:text-fintech-text'}`}>
              {tx.type === 'income' ? '+' : '-'}${tx.amount?.toFixed(2)}
            </Text>
          </View>
        ))
      )}
      
      <View className="h-10" />

    </ScrollView>
  );
}
