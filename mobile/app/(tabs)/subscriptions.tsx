import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import api from '../../utils/api';

export default function SubscriptionsScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get('/subscriptions');
      setSubscriptions(res.data);
    } catch (error) {
      console.warn('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubscriptions();
  };

  const totalMonthly = subscriptions.reduce((acc: number, sub: any) => {
    return sub.billingCycle === 'yearly' ? acc + (sub.amount / 12) : acc + sub.amount;
  }, 0);

  return (
    <ScrollView 
      className="flex-1 bg-fintech-background dark:bg-fintech-background p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F0FF" />}
    >
      <View className="mt-8 mb-6">
        <Text className="text-3xl font-bold text-fintech-text dark:text-fintech-text">Subscriptions</Text>
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted mt-1">Manage your recurring payments</Text>
      </View>

      <View className="bg-fintech-secondary p-6 rounded-3xl mb-8 shadow-lg shadow-fintech-secondary/40">
        <Text className="text-fintech-background text-sm mb-1 font-medium">Monthly Burn Rate</Text>
        <Text className="text-fintech-background text-4xl font-bold">${totalMonthly.toFixed(2)}</Text>
        <Text className="text-fintech-background/80 text-xs mt-2">You have {subscriptions.length} active subscriptions</Text>
      </View>

      <View className="flex-row justify-between mb-4 items-end">
        <Text className="text-lg font-bold text-fintech-text dark:text-fintech-text">Active Subscriptions</Text>
        <TouchableOpacity>
          <Text className="text-fintech-primary text-sm font-medium">+ Add New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" />
      ) : subscriptions.length === 0 ? (
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-center my-4">No subscriptions found</Text>
      ) : (
        subscriptions.map((sub: any, i) => (
          <View key={sub._id || i} className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-xl bg-fintech-background dark:bg-fintech-background items-center justify-center mr-4">
                <Text className="text-xl">📅</Text>
              </View>
              <View>
                <Text className="text-fintech-text dark:text-fintech-text font-bold text-base">{sub.name}</Text>
                <View className="flex-row items-center mt-1">
                  {sub.isAutoDetected && (
                    <View className="bg-fintech-primary/20 px-2 py-0.5 rounded mr-2">
                      <Text className="text-fintech-primary text-[10px] font-bold">Auto</Text>
                    </View>
                  )}
                  <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs">
                    Renews {new Date(sub.nextBillingDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-fintech-text dark:text-fintech-text font-bold text-lg">${sub.amount?.toFixed(2)}</Text>
              <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-xs mt-1">/{sub.billingCycle === 'yearly' ? 'yr' : 'mo'}</Text>
            </View>
          </View>
        ))
      )}
      
      {subscriptions.length > 0 && (
        <View className="mt-6 p-4 bg-fintech-primary/10 rounded-2xl mb-10">
          <Text className="text-fintech-primary font-bold mb-1">💡 Optimization Tip</Text>
          <Text className="text-fintech-text dark:text-fintech-text text-sm">
            Review your subscriptions to lower your monthly burn rate by cutting unused services!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
