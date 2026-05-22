import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.user, data.token);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'Signup failed');
      }
    } catch (error) {
      console.warn('Backend not reachable, mocking signup', error);
      login({ id: '1', email, firstName, lastName }, 'mock-token');
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView className="flex-1 bg-fintech-background dark:bg-fintech-background" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
      <View className="items-center mb-8 mt-10">
        <Text className="text-3xl font-bold text-fintech-text dark:text-fintech-text mb-2">
          Create Account
        </Text>
        <Text className="text-fintech-textMuted dark:text-fintech-textMuted text-center">
          Join FinTrack and take control
        </Text>
      </View>

      <View className="space-y-4">
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className="text-fintech-text dark:text-fintech-text mb-2 font-medium">First Name</Text>
            <TextInput
              className="w-full bg-fintech-surface dark:bg-fintech-surface text-fintech-text dark:text-fintech-text p-4 rounded-xl border border-gray-200 dark:border-gray-800"
              placeholder="John"
              placeholderTextColor="#9E9E9E"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View className="flex-1">
            <Text className="text-fintech-text dark:text-fintech-text mb-2 font-medium">Last Name</Text>
            <TextInput
              className="w-full bg-fintech-surface dark:bg-fintech-surface text-fintech-text dark:text-fintech-text p-4 rounded-xl border border-gray-200 dark:border-gray-800"
              placeholder="Doe"
              placeholderTextColor="#9E9E9E"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View>
          <Text className="text-fintech-text dark:text-fintech-text mb-2 font-medium">Email</Text>
          <TextInput
            className="w-full bg-fintech-surface dark:bg-fintech-surface text-fintech-text dark:text-fintech-text p-4 rounded-xl border border-gray-200 dark:border-gray-800"
            placeholder="john.doe@example.com"
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
            placeholder="Create a strong password"
            placeholderTextColor="#9E9E9E"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          className="w-full bg-fintech-primary py-4 rounded-xl items-center mt-6 shadow-md shadow-fintech-primary/30"
          onPress={handleSignup}
        >
          <Text className="text-fintech-background font-bold text-lg">Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="w-full py-4 items-center mb-10"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-fintech-textMuted dark:text-fintech-textMuted">
            Already have an account? <Text className="text-fintech-primary font-bold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
