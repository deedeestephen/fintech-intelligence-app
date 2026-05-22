import React from 'react';
import { View, Text } from 'react-native';

interface InsightProps {
  insight: {
    type?: string;
    title?: string;
    description: string;
    icon?: string;
    amount?: number;
    date?: string;
  };
  isAnomaly?: boolean;
}

export default function InsightCard({ insight, isAnomaly = false }: InsightProps) {
  return (
    <View className={`w-72 p-4 rounded-2xl mr-4 shadow-sm ${isAnomaly ? 'bg-fintech-danger/10 border border-fintech-danger/20' : 'bg-fintech-primary/10 border border-fintech-primary/20'}`}>
      <View className="flex-row items-center mb-2">
        <Text className="text-xl mr-2">{insight.icon || (isAnomaly ? '⚠️' : '💡')}</Text>
        <Text className={`font-bold text-base ${isAnomaly ? 'text-fintech-danger' : 'text-fintech-primary'}`}>
          {insight.title || (isAnomaly ? 'Anomaly Detected' : 'Smart Insight')}
        </Text>
      </View>
      <Text className="text-fintech-text dark:text-fintech-text text-sm mb-2 leading-5">
        {insight.description}
      </Text>
      
      {isAnomaly && insight.amount && (
        <View className="bg-fintech-background dark:bg-fintech-background self-start px-3 py-1.5 rounded-lg mt-1">
          <Text className="text-fintech-danger font-bold">Charge: ${insight.amount.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
}
