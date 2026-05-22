import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import api from '../../utils/api';

export default function ExpensesScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.warn('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  return (
    <ScrollView 
      className="flex-1 bg-fintech-background dark:bg-fintech-background p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F0FF" />}
    >
      <View className="mt-8 mb-6">
        <Text className="text-3xl font-bold text-fintech-text dark:text-fintech-text">Transactions</Text>
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted mt-1">Track where your money goes</Text>
      </View>

      <View className="flex-row justify-between mb-6">
        <TouchableOpacity className="flex-1 bg-fintech-primary p-3 rounded-xl mr-2 items-center">
          <Text className="text-fintech-background font-bold">This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-fintech-surface dark:bg-fintech-surface p-3 rounded-xl ml-2 items-center">
          <Text className="text-fintech-text dark:text-fintech-text font-bold">This Month</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-bold text-fintech-text dark:text-fintech-text mb-4">Transaction History</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" />
      ) : transactions.length === 0 ? (
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-center my-4">No transactions found</Text>
      ) : (
        transactions.map((tx: any, i) => (
          <View key={tx._id || i} className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-fintech-background dark:bg-fintech-background items-center justify-center mr-4">
                <Text>{tx.type === 'income' ? '💰' : '🛒'}</Text>
              </View>
              <View>
                <Text className="text-fintech-text dark:text-fintech-text font-bold text-base">{tx.category || 'Unknown'}</Text>
                <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs">{new Date(tx.date).toLocaleDateString()}</Text>
              </View>
            </View>
            <Text className={`font-bold text-lg ${tx.type === 'income' ? 'text-fintech-success' : 'text-fintech-text dark:text-fintech-text'}`}>
              {tx.type === 'income' ? '+' : '-'}${tx.amount?.toFixed(2)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
