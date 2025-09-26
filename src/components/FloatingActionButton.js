import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function FloatingActionButton({ onPress, icon = "add", style }) {
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';
  
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleValue = new Animated.Value(1);
  const rotateValue = new Animated.Value(0);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Rotate animation
    Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onPress && onPress();
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const QuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={[styles.quickActionButton, isDark && styles.quickActionButtonDark]}
        onPress={() => {
          setIsExpanded(false);
          // Handle quick action
        }}
      >
        <Ionicons name="mic" size={20} color={isDark ? "#FFFFFF" : "#007AFF"} />
        <Text style={[styles.quickActionText, isDark && styles.quickActionTextDark]}>
          Voice
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.quickActionButton, isDark && styles.quickActionButtonDark]}
        onPress={() => {
          setIsExpanded(false);
          // Handle quick action
        }}
      >
        <Ionicons name="camera" size={20} color={isDark ? "#FFFFFF" : "#007AFF"} />
        <Text style={[styles.quickActionText, isDark && styles.quickActionTextDark]}>
          Scan
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.quickActionButton, isDark && styles.quickActionButtonDark]}
        onPress={() => {
          setIsExpanded(false);
          // Handle quick action
        }}
      >
        <Ionicons name="location" size={20} color={isDark ? "#FFFFFF" : "#007AFF"} />
        <Text style={[styles.quickActionText, isDark && styles.quickActionTextDark]}>
          Location
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {isExpanded && <QuickActions />}
      
      {/* Main FAB */}
      <Animated.View
        style={[
          styles.fab,
          isDark && styles.fabDark,
          {
            transform: [
              { scale: scaleValue },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabTouchable}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setIsExpanded(!isExpanded);
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={icon}
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Ripple Effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            transform: [{ scale: scaleValue }],
            opacity: scaleValue.interpolate({
              inputRange: [0.9, 1],
              outputRange: [0.3, 0],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabDark: {
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.1,
  },
  fabTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  ripple: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
  },
  quickActionsContainer: {
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  quickActionButtonDark: {
    backgroundColor: '#1C1C1E',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  quickActionTextDark: {
    color: '#FFFFFF',
  },
});