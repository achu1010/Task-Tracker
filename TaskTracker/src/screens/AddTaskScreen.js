import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';

import { addTask } from '../store/slices/taskSlice';

export default function AddTaskScreen({ navigation }) {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.tasks);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  const [task, setTask] = useState({
    title: '',
    description: '',
    category: categories[0] || 'Personal',
    priority: 'medium',
    dueDate: null,
    tags: '',
    timeEstimate: '',
    reminder: {
      enabled: false,
      time: new Date(),
    },
    location: {
      address: '',
      enabled: false,
    },
    recurring: {
      enabled: false,
      type: 'daily',
      interval: 1,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [subtasks, setSubtasks] = useState(['']);

  const priorities = [
    { label: 'Low', value: 'low', color: '#34C759', icon: 'arrow-down-circle' },
    { label: 'Medium', value: 'medium', color: '#FFCC02', icon: 'remove-circle' },
    { label: 'High', value: 'high', color: '#FF9500', icon: 'arrow-up-circle' },
    { label: 'Urgent', value: 'urgent', color: '#FF3B30', icon: 'alert-circle' },
  ];

  const handleSave = () => {
    if (!task.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      title: task.title.trim(),
      description: task.description.trim(),
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      tags: task.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      timeEstimate: task.timeEstimate ? parseInt(task.timeEstimate) : undefined,
      reminder: task.reminder.enabled ? task.reminder : undefined,
      location: task.location.enabled ? task.location : undefined,
      recurring: task.recurring.enabled ? task.recurring : undefined,
      subtasks: subtasks
        .filter(st => st.trim().length > 0)
        .map(st => ({
          id: Date.now().toString() + Math.random(),
          title: st.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        })),
      completed: false,
    };

    dispatch(addTask(newTask));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const updateSubtask = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const removeSubtask = (index) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Title *</Text>
          <TextInput
            style={[styles.textInput, isDark && styles.textInputDark]}
            placeholder="What needs to be done?"
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={task.title}
            onChangeText={(text) => setTask({...task, title: text})}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea, isDark && styles.textInputDark]}
            placeholder="Add details about this task..."
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={task.description}
            onChangeText={(text) => setTask({...task, description: text})}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Category & Priority */}
        <View style={styles.row}>
          <View style={[styles.section, styles.halfWidth]}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Category</Text>
            <View style={[styles.pickerContainer, isDark && styles.pickerContainerDark]}>
              <Picker
                selectedValue={task.category}
                onValueChange={(value) => setTask({...task, category: value})}
                style={[styles.picker, isDark && styles.pickerDark]}
              >
                {categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={[styles.section, styles.halfWidth]}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Priority</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.priorityContainer}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.value}
                    style={[
                      styles.priorityButton,
                      task.priority === priority.value && styles.priorityButtonActive,
                      { borderColor: priority.color },
                      task.priority === priority.value && { backgroundColor: priority.color },
                    ]}
                    onPress={() => setTask({...task, priority: priority.value})}
                  >
                    <Ionicons
                      name={priority.icon}
                      size={16}
                      color={task.priority === priority.value ? '#FFFFFF' : priority.color}
                    />
                    <Text
                      style={[
                        styles.priorityText,
                        { color: task.priority === priority.value ? '#FFFFFF' : priority.color },
                      ]}
                    >
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Due Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, isDark && styles.dateButtonDark]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color={isDark ? '#007AFF' : '#007AFF'} />
            <Text style={[styles.dateButtonText, isDark && styles.dateButtonTextDark]}>
              {task.dueDate ? task.dueDate.toLocaleDateString() : 'Select due date'}
            </Text>
            {task.dueDate && (
              <TouchableOpacity onPress={() => setTask({...task, dueDate: null})}>
                <Ionicons name="close-circle" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Time Estimate */}
        <View style={styles.section}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Estimated Time (minutes)</Text>
          <TextInput
            style={[styles.textInput, isDark && styles.textInputDark]}
            placeholder="How long will this take?"
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={task.timeEstimate}
            onChangeText={(text) => setTask({...task, timeEstimate: text})}
            keyboardType="numeric"
          />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Tags</Text>
          <TextInput
            style={[styles.textInput, isDark && styles.textInputDark]}
            placeholder="work, important, meeting (comma separated)"
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={task.tags}
            onChangeText={(text) => setTask({...task, tags: text})}
          />
        </View>

        {/* Subtasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Subtasks</Text>
            <TouchableOpacity onPress={addSubtask} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {subtasks.map((subtask, index) => (
            <View key={index} style={styles.subtaskRow}>
              <TextInput
                style={[styles.textInput, styles.subtaskInput, isDark && styles.textInputDark]}
                placeholder={`Subtask ${index + 1}`}
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                value={subtask}
                onChangeText={(text) => updateSubtask(index, text)}
              />
              {subtasks.length > 1 && (
                <TouchableOpacity onPress={() => removeSubtask(index)} style={styles.removeButton}>
                  <Ionicons name="remove-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Reminder */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Set Reminder</Text>
            <Switch
              value={task.reminder.enabled}
              onValueChange={(value) => setTask({
                ...task,
                reminder: { ...task.reminder, enabled: value }
              })}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor={task.reminder.enabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          {task.reminder.enabled && (
            <TouchableOpacity
              style={[styles.dateButton, isDark && styles.dateButtonDark]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time" size={20} color={isDark ? '#007AFF' : '#007AFF'} />
              <Text style={[styles.dateButtonText, isDark && styles.dateButtonTextDark]}>
                {task.reminder.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recurring */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Recurring Task</Text>
            <Switch
              value={task.recurring.enabled}
              onValueChange={(value) => setTask({
                ...task,
                recurring: { ...task.recurring, enabled: value }
              })}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor={task.recurring.enabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          {task.recurring.enabled && (
            <View style={[styles.pickerContainer, isDark && styles.pickerContainerDark]}>
              <Picker
                selectedValue={task.recurring.type}
                onValueChange={(value) => setTask({
                  ...task,
                  recurring: { ...task.recurring, type: value }
                })}
                style={[styles.picker, isDark && styles.pickerDark]}
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
              </Picker>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, isDark && styles.actionButtonsDark]}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={task.dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setTask({...task, dueDate: selectedDate});
            }
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={task.reminder.time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setTask({
                ...task,
                reminder: { ...task.reminder, time: selectedTime }
              });
            }
          }}
        />
      )}
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textInputDark: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    borderColor: '#38383A',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  pickerContainerDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
  },
  picker: {
    height: 50,
  },
  pickerDark: {
    color: '#FFFFFF',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  priorityButtonActive: {
    // Background color set dynamically
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 12,
  },
  dateButtonDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  dateButtonTextDark: {
    color: '#FFFFFF',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  subtaskInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
    gap: 12,
  },
  actionButtonsDark: {
    borderTopColor: '#38383A',
    backgroundColor: '#000000',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});