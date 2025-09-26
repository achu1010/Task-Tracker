import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const { tasks } = useSelector(state => state.tasks);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get tasks for the selected date
  const tasksForDate = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
    return taskDate === selectedDate;
  });

  // Create marked dates for calendar
  const markedDates = {};
  tasks.forEach(task => {
    if (task.dueDate) {
      const date = new Date(task.dueDate).toISOString().split('T')[0];
      if (!markedDates[date]) {
        markedDates[date] = { marked: true, dots: [] };
      }
      
      const color = task.completed ? '#34C759' : 
                   task.priority === 'urgent' ? '#FF3B30' :
                   task.priority === 'high' ? '#FF9500' :
                   task.priority === 'medium' ? '#FFCC02' : '#007AFF';
      
      markedDates[date].dots.push({ color });
    }
  });

  // Mark selected date
  if (markedDates[selectedDate]) {
    markedDates[selectedDate].selected = true;
    markedDates[selectedDate].selectedColor = '#007AFF';
  } else {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#007AFF',
    };
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          calendarBackground: isDark ? '#1C1C1E' : '#FFFFFF',
          textSectionTitleColor: isDark ? '#FFFFFF' : '#000000',
          dayTextColor: isDark ? '#FFFFFF' : '#000000',
          todayTextColor: '#007AFF',
          selectedDayTextColor: '#FFFFFF',
          monthTextColor: isDark ? '#FFFFFF' : '#000000',
          arrowColor: '#007AFF',
          textDisabledColor: isDark ? '#3A3A3C' : '#C7C7CC',
        }}
        style={styles.calendar}
      />

      <View style={styles.tasksSection}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Tasks for {new Date(selectedDate).toLocaleDateString()}
        </Text>
        
        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {tasksForDate.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="calendar-outline" 
                size={64} 
                color={isDark ? '#3A3A3C' : '#C7C7CC'} 
              />
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No tasks scheduled for this date
              </Text>
            </View>
          ) : (
            tasksForDate.map((task) => (
              <View key={task.id} style={[styles.taskItem, isDark && styles.taskItemDark]}>
                <View
                  style={[
                    styles.priorityDot,
                    {
                      backgroundColor: task.completed ? '#34C759' :
                                     task.priority === 'urgent' ? '#FF3B30' :
                                     task.priority === 'high' ? '#FF9500' :
                                     task.priority === 'medium' ? '#FFCC02' : '#007AFF'
                    }
                  ]}
                />
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle,
                    isDark && styles.taskTitleDark,
                    task.completed && styles.taskTitleCompleted
                  ]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.taskCategory, isDark && styles.taskCategoryDark]}>
                    {task.category} • {task.priority}
                  </Text>
                </View>
                <Ionicons
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={task.completed ? "#34C759" : (isDark ? "#8E8E93" : "#C7C7CC")}
                />
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  calendar: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tasksSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  tasksList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskItemDark: {
    backgroundColor: '#1C1C1E',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  taskTitleDark: {
    color: '#FFFFFF',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskCategory: {
    fontSize: 14,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  taskCategoryDark: {
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 40,
  },
  emptyTextDark: {
    color: '#8E8E93',
  },
});