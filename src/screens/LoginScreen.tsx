import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';

export default function LoginScreen({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/token', {
        username,
        password,
      });

      if (response.data && response.data.access) {
        await SecureStore.setItemAsync('auth_token', response.data.access);
        await SecureStore.setItemAsync('refresh_token', response.data.refresh || '');
        if (onLogin) {
          onLogin();
        }
      }
    } catch (error: any) {
      console.error('Login failed', error.response?.data || error.message);
      Alert.alert(
        'Login Failed', 
        error.response?.data?.detail || 'Invalid credentials or server error.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.formContainer}>
        {/* Branding / Logo Area */}
        <View style={styles.headerContainer}>
          <Text style={styles.logoText}>🥥 SRK</Text>
          <Text style={styles.title}>Coconut ERP</Text>
          <Text style={styles.subtitle}>Sign in to continue to operations</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#64748B"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, loading && { opacity: 0.7 }]} 
          onPress={handleLogin} 
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Premium dark theme background
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    color: '#F8FAFC',
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#38BDF8', // Vibrant accent color
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
