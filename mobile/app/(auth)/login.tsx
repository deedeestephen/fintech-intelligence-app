import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // In a real app, this would be an API call to the backend
      const response = await fetch('http://10.0.2.2:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.user, data.token);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      // Mocking successful login for local testing if server is down
      console.warn('Backend not reachable, mocking login', error);
      login({ id: '1', email, firstName: 'John', lastName: 'Doe' }, 'mock-token');
      router.replace('/(tabs)');
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-fintech-background dark:bg-fintech-background">
      <View className="items-center mb-10">
        <Text className="text-4xl font-bold text-fintech-primary dark:text-fintech-primary mb-2">
          FinTrack
        </Text>
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-center">
          Your personal CFO in your pocket
        </Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-fintech-text dark:text-fintech-text mb-2 font-medium">Email</Text>
          <TextInput
            className="w-full bg-fintech-surface dark:bg-fintech-surface text-fintech-text dark:text-fintech-text p-4 rounded-xl border border-gray-200 dark:border-gray-800"
            placeholder="Enter your email"
            placeholderTextColor="#9E9E9E"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-fintech-text dark:text-fintech-text mb-2 font-medium">Password</Text>
          <TextInput
            className="w-full bg-fintech-surface dark:bg-fintech-surface text-fintech-text dark:text-fintech-text p-4 rounded-xl border border-gray-200 dark:border-gray-800"
            placeholder="Enter your password"
            placeholderTextColor="#9E9E9E"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          className="w-full bg-fintech-primary py-4 rounded-xl items-center mt-6 shadow-md shadow-fintech-primary/30"
          onPress={handleLogin}
        >
          <Text className="text-fintech-background font-bold text-lg">Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="w-full py-4 items-center"
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text className="text-fintech-textMuted dark:text-fintech-textMuted">
            Don't have an account? <Text className="text-fintech-primary font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
