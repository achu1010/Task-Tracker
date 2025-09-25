import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { setUser } from '../store/slices/userSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      const user = {
        id: '1',
        email: email.trim(),
        name: 'TaskTracker User',
        preferences: {
          defaultCategory: 'Personal',
          defaultPriority: 'medium',
          notifications: true,
          darkMode: isDark,
        },
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          streak: 0,
          points: 0,
          badges: [],
        },
      };
      
      dispatch(setUser(user));
      setIsLoading(false);
    }, 1500);
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest',
      email: 'guest@tasktracker.com',
      name: 'Guest User',
      preferences: {
        defaultCategory: 'Personal',
        defaultPriority: 'medium',
        notifications: false,
        darkMode: isDark,
      },
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        streak: 0,
        points: 0,
        badges: [],
      },
    };
    
    dispatch(setUser(guestUser));
  };

  return (
    <LinearGradient
      colors={isDark ? ['#000000', '#1C1C1E'] : ['#007AFF', '#0056CC']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
          <Text style={styles.title}>TaskTracker</Text>
          <Text style={styles.subtitle}>Organize your life, one task at a time</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <Ionicons name="mail" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Email"
              placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <Ionicons name="lock-closed" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Password"
              placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  inputContainerDark: {
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  inputDark: {
    color: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginRight: 4,
  },
  footerLink: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});