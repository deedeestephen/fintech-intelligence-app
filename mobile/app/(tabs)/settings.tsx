import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useColorScheme } from 'nativewind';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { colorScheme } = useColorScheme();

  const handleLogout = () => {
    logout();
  };

  const isDarkMode = theme === 'dark' || (theme === 'system' && colorScheme === 'dark');

  return (
    <ScrollView className="flex-1 bg-fintech-background dark:bg-fintech-background p-4">
      <View className="mt-8 mb-6">
        <Text className="text-3xl font-bold text-fintech-text dark:text-fintech-text">Settings</Text>
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted mt-1">Preferences and account</Text>
      </View>

      <View className="bg-fintech-surface dark:bg-fintech-surface p-6 rounded-3xl mb-8 flex-row items-center shadow-sm">
        <View className="w-16 h-16 bg-fintech-primary rounded-full items-center justify-center mr-4">
          <Text className="text-2xl text-fintech-background font-bold">
            {user?.firstName?.[0] || 'U'}
          </Text>
        </View>
        <View>
          <Text className="text-xl font-bold text-fintech-text dark:text-fintech-text">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-fintech-textMuted dark:text-fintech-textMuted">{user?.email}</Text>
        </View>
      </View>

      <Text className="text-lg font-bold text-fintech-text dark:text-fintech-text mb-4">Appearance</Text>
      
      <View className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-6 shadow-sm space-y-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-xl mr-3">📱</Text>
            <Text className="text-fintech-text dark:text-fintech-text font-bold text-base">Theme Strategy</Text>
          </View>
          <View className="flex-row bg-fintech-background dark:bg-fintech-background rounded-lg p-1">
            <TouchableOpacity 
              className={`px-3 py-1.5 rounded-md ${theme === 'light' ? 'bg-fintech-primary' : ''}`}
              onPress={() => setTheme('light')}
            >
              <Text className={theme === 'light' ? 'text-fintech-background font-bold' : 'text-fintech-textMuted dark:text-fintech-textMuted'}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`px-3 py-1.5 rounded-md ${theme === 'dark' ? 'bg-fintech-primary' : ''}`}
              onPress={() => setTheme('dark')}
            >
              <Text className={theme === 'dark' ? 'text-fintech-background font-bold' : 'text-fintech-textMuted dark:text-fintech-textMuted'}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`px-3 py-1.5 rounded-md ${theme === 'system' ? 'bg-fintech-primary' : ''}`}
              onPress={() => setTheme('system')}
            >
              <Text className={theme === 'system' ? 'text-fintech-background font-bold' : 'text-fintech-textMuted dark:text-fintech-textMuted'}>Auto</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="h-px w-full bg-fintech-background dark:bg-fintech-background" />

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-xl mr-3">💰</Text>
            <Text className="text-fintech-text dark:text-fintech-text font-bold text-base">Base Currency</Text>
          </View>
          <Text className="text-fintech-textMuted dark:text-fintech-textMuted font-bold">USD ($)</Text>
        </View>
      </View>

      <Text className="text-lg font-bold text-fintech-text dark:text-fintech-text mb-4">Security</Text>

      <View className="bg-fintech-surface dark:bg-fintech-surface p-4 rounded-2xl mb-8 shadow-sm space-y-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-xl mr-3">🔐</Text>
            <Text className="text-fintech-text dark:text-fintech-text font-bold text-base">Biometric Login</Text>
          </View>
          <Switch value={true} trackColor={{ true: '#00F0FF', false: '#333' }} />
        </View>
        <View className="h-px w-full bg-fintech-background dark:bg-fintech-background" />
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-xl mr-3">🔑</Text>
          <Text className="text-fintech-text dark:text-fintech-text font-bold text-base">Change PIN / Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        className="bg-fintech-danger/10 py-4 rounded-xl items-center mb-10"
        onPress={handleLogout}
      >
        <Text className="text-fintech-danger font-bold text-lg">Log Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
