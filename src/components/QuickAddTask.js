import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

import { addTask } from '../store/slices/taskSlice';

export default function QuickAddTask() {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.settings);
  const { categories } = useSelector(state => state.tasks);
  const isDark = theme === 'dark';

  const [taskText, setTaskText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleAddTask = () => {
    if (!taskText.trim()) return;

    // Parse natural language input
    const parsedTask = parseNaturalLanguage(taskText);
    
    const newTask = {
      title: parsedTask.title,
      description: parsedTask.description || '',
      priority: parsedTask.priority || 'medium',
      category: parsedTask.category || categories[0] || 'Personal',
      tags: parsedTask.tags || [],
      dueDate: parsedTask.dueDate,
      completed: false,
      subtasks: [],
      timeEstimate: parsedTask.timeEstimate,
      reminder: parsedTask.reminder,
    };

    dispatch(addTask(newTask));
    setTaskText('');
    setIsExpanded(false);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Provide feedback
    if (parsedTask.hasNaturalLanguage) {
      Alert.alert(
        'Task Added!',
        `I understood: ${parsedTask.interpretation}`,
        [{ text: 'Great!', style: 'default' }]
      );
    }
  };

  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Placeholder for voice recognition
      // In a real app, you'd use react-native-voice or similar
      setTimeout(() => {
        setIsListening(false);
        Alert.alert(
          'Voice Input',
          'Voice recognition would be implemented here using react-native-voice',
          [{ text: 'OK' }]
        );
      }, 2000);
    } catch (error) {
      console.error('Voice input error:', error);
      setIsListening(false);
    }
  };

  const parseNaturalLanguage = (input) => {
    const result = {
      title: input,
      hasNaturalLanguage: false,
      interpretation: '',
    };

    // Simple natural language parsing
    const lowercaseInput = input.toLowerCase();
    
    // Extract priority
    if (lowercaseInput.includes('urgent') || lowercaseInput.includes('asap')) {
      result.priority = 'urgent';
      result.hasNaturalLanguage = true;
    } else if (lowercaseInput.includes('high priority') || lowercaseInput.includes('important')) {
      result.priority = 'high';
      result.hasNaturalLanguage = true;
    } else if (lowercaseInput.includes('low priority') || lowercaseInput.includes('whenever')) {
      result.priority = 'low';
      result.hasNaturalLanguage = true;
    }

    // Extract due dates
    const today = new Date();
    if (lowercaseInput.includes('today')) {
      result.dueDate = today.toISOString();
      result.hasNaturalLanguage = true;
    } else if (lowercaseInput.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      result.dueDate = tomorrow.toISOString();
      result.hasNaturalLanguage = true;
    } else if (lowercaseInput.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      result.dueDate = nextWeek.toISOString();
      result.hasNaturalLanguage = true;
    }

    // Extract time estimates
    const timeMatch = lowercaseInput.match(/(\d+)\s*(minute|min|hour|hr)s?/);
    if (timeMatch) {
      const amount = parseInt(timeMatch[1]);
      const unit = timeMatch[2];
      result.timeEstimate = unit.startsWith('hour') ? amount * 60 : amount;
      result.hasNaturalLanguage = true;
    }

    // Extract categories
    categories.forEach(category => {
      if (lowercaseInput.includes(category.toLowerCase())) {
        result.category = category;
        result.hasNaturalLanguage = true;
      }
    });

    // Clean up title
    if (result.hasNaturalLanguage) {
      result.title = input
        .replace(/\b(urgent|asap|high priority|important|low priority|whenever|today|tomorrow|next week)\b/gi, '')
        .replace(/\b\d+\s*(minute|min|hour|hr)s?\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      result.interpretation = `Priority: ${result.priority || 'medium'}${result.dueDate ? `, Due: ${formatDueDate(result.dueDate)}` : ''}${result.timeEstimate ? `, Est: ${result.timeEstimate}min` : ''}`;
    }

    return result;
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Add new task... (try 'Call mom tomorrow urgent')"
          placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
          value={taskText}
          onChangeText={setTaskText}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
          multiline={isExpanded}
          numberOfLines={isExpanded ? 3 : 1}
        />
        
        <View style={styles.buttonContainer}>
          {/* Voice Input Button */}
          <TouchableOpacity
            style={[styles.actionButton, isListening && styles.actionButtonActive]}
            onPress={handleVoiceInput}
            disabled={isListening}
          >
            <Ionicons
              name={isListening ? "radio-button-on" : "mic"}
              size={20}
              color={isListening ? "#FF3B30" : (isDark ? "#007AFF" : "#007AFF")}
            />
          </TouchableOpacity>
          
          {/* Expand Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={isDark ? "#007AFF" : "#007AFF"}
            />
          </TouchableOpacity>
          
          {/* Add Button */}
          <TouchableOpacity
            style={[
              styles.addButton,
              taskText.trim().length === 0 && styles.addButtonDisabled,
            ]}
            onPress={handleAddTask}
            disabled={taskText.trim().length === 0}
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {isExpanded && (
        <View style={styles.expandedOptions}>
          <Text style={[styles.helpText, isDark && styles.helpTextDark]}>
            💡 Try natural language: "Meeting with John tomorrow 2pm urgent" or "Buy groceries low priority 30 minutes"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  containerDark: {
    // Dark theme specific styles
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    minHeight: 24,
    maxHeight: 80,
  },
  inputDark: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  actionButtonActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  expandedOptions: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#007AFF',
    lineHeight: 16,
  },
  helpTextDark: {
    color: '#007AFF',
  },
});