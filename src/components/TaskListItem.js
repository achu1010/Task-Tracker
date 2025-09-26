import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function TaskListItem({ task, onToggleComplete, onPress }) {
  const { title, completed, dueDate } = task;
  
  // Format the due date if it exists
  const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) : null;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = dueDate && 
    new Date(dueDate).toDateString() === tomorrow.toDateString();
  
  const today = new Date();
  const isToday = dueDate && 
    new Date(dueDate).toDateString() === today.toDateString();
  
  // Determine if task is overdue
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !completed;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={onToggleComplete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {completed ? (
          <View style={styles.checkedBox}>
            <Ionicons name="checkmark" size={20} color={Colors.primary} />
          </View>
        ) : (
          <View style={styles.uncheckedBox} />
        )}
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text 
          style={[
            styles.title, 
            completed && styles.completedTitle,
            isOverdue && styles.overdueTitle
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        {(isToday || isTomorrow || formattedDate) && (
          <Text 
            style={[
              styles.dateText,
              isOverdue && styles.overdueDate
            ]}
          >
            {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : formattedDate}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    marginVertical: 5,
    padding: 15,
    paddingRight: 20,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 15,
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  overdueTitle: {
    color: Colors.danger,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  overdueDate: {
    color: Colors.danger,
  },
});