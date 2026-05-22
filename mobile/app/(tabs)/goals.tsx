import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import api from '../../utils/api';

export default function GoalsScreen() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (error) {
      console.warn('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGoals();
  };

  return (
    <ScrollView 
      className="flex-1 bg-fintech-background dark:bg-fintech-background p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F0FF" />}
    >
      <View className="mt-8 mb-6">
        <Text className="text-3xl font-bold text-fintech-text dark:text-fintech-text">Savings Goals</Text>
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted mt-1">Track your financial milestones</Text>
      </View>

      <TouchableOpacity className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-6 items-center border border-dashed border-fintech-primary/50">
        <Text className="text-fintech-primary font-bold">+ Create New Goal</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" />
      ) : goals.length === 0 ? (
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-center my-4">No goals created yet</Text>
      ) : (
        goals.map((goal: any, i) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          
          return (
            <View key={goal._id || i} className="bg-fintech-surface dark:bg-fintech-surface p-5 rounded-3xl mb-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-fintech-background dark:bg-fintech-background items-center justify-center mr-3">
                    <Text>🎯</Text>
                  </View>
                  <Text className="text-fintech-text dark:text-fintech-text font-bold text-lg">{goal.name}</Text>
                </View>
                <Text className="text-fintech-primary font-bold">{progress.toFixed(0)}%</Text>
              </View>
              
              <View className="h-2 bg-fintech-background dark:bg-fintech-background rounded-full mb-3 overflow-hidden">
                <View 
                  className="h-full bg-fintech-primary rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs">
                  Saved: <Text className="text-fintech-text dark:text-fintech-text font-bold">${goal.currentAmount?.toFixed(2)}</Text>
                </Text>
                <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs">
                  Goal: <Text className="text-fintech-text dark:text-fintech-text font-bold">${goal.targetAmount?.toFixed(2)}</Text>
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
