import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Switch,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';

import { addTask } from '../store/slices/taskSlice';
import { scheduleTaskNotification } from '../utils/notifications';

export default function TaskFormModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.settings);
  const { categories } = useSelector(state => state.tasks);
  const isDark = theme === 'dark';
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [enableNotification, setEnableNotification] = useState(true);

  const resetForm = () => {
    setTaskTitle('');
    setTaskDesc('');
    setCategory(categories[0] || 'Personal');
    setPriority('medium');
    setDueDate(null);
    setEnableNotification(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!taskTitle.trim()) {
      // Haptic feedback for error
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    // Generate task ID
    const taskId = Date.now().toString();
    
    const newTask = {
      id: taskId,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      category,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      notificationId: null,
    };
    
    // Schedule notification if due date is set and notification is enabled
    if (dueDate && enableNotification) {
      try {
        const notificationId = await scheduleTaskNotification(
          taskId,
          taskTitle.trim(),
          taskDesc.trim() || 'Task due soon!',
          dueDate
        );
        
        if (notificationId) {
          newTask.notificationId = notificationId;
        }
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }
    
    // Add task to store
    dispatch(addTask(newTask));
    
    // Success feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Close modal and reset form
    handleClose();
  };
  
  // Priority options with colors
  const priorities = [
    { label: 'Low', value: 'low', color: '#34C759' },
    { label: 'Med', value: 'medium', color: '#FFCC02' },
    { label: 'High', value: 'high', color: '#FF9500' },
    { label: 'Urgent', value: 'urgent', color: '#FF3B30' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
              <View style={styles.handle} />
              
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                Quick Add Task
              </Text>
              
              {/* Task Title Input */}
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="What needs to be done?"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={taskTitle}
                onChangeText={setTaskTitle}
                autoFocus
              />
              
              {/* Task Description */}
              <TextInput
                style={[styles.input, styles.descriptionInput, isDark && styles.inputDark]}
                placeholder="Add description (optional)"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={taskDesc}
                onChangeText={setTaskDesc}
                multiline
              />
              
              {/* Priority Selection */}
              <View style={styles.priorityContainer}>
                <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                  Priority:
                </Text>
                <View style={styles.priorityButtons}>
                  {priorities.map((p) => (
                    <TouchableOpacity
                      key={p.value}
                      style={[
                        styles.priorityButton,
                        priority === p.value && styles.priorityButtonSelected,
                        priority === p.value && { backgroundColor: p.color },
                        { borderColor: p.color },
                      ]}
                      onPress={() => setPriority(p.value)}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: priority === p.value ? '#FFFFFF' : p.color },
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Due Date Selection */}
              <View style={styles.dueDateContainer}>
                <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                  Due Date:
                </Text>
                
                <TouchableOpacity
                  style={[styles.dateButton, isDark && styles.dateButtonDark]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color={isDark ? '#0A84FF' : '#007AFF'}
                    style={styles.dateIcon}
                  />
                  <Text style={[styles.dateText, isDark && styles.dateTextDark]}>
                    {dueDate ? dueDate.toDateString() : 'Set due date'}
                  </Text>
                  
                  {dueDate && (
                    <TouchableOpacity onPress={() => setDueDate(null)}>
                      <Ionicons name="close-circle" size={18} color={isDark ? '#8E8E93' : '#C7C7CC'} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                
                {/* Date Picker */}
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setDueDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              
              {/* Notification Toggle */}
              {dueDate && (
                <View style={styles.notificationContainer}>
                  <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                    Remind me
                  </Text>
                  <Switch
                    value={enableNotification}
                    onValueChange={setEnableNotification}
                    trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                    thumbColor={enableNotification ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              )}
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.saveButton,
                    !taskTitle.trim() && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!taskTitle.trim()}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  priorityContainer: {
    marginBottom: 15,
  },
  priorityButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityButtonSelected: {
    borderWidth: 0,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dueDateContainer: {
    marginBottom: 15,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  dateButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  dateTextDark: {
    color: '#FFFFFF',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
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
  saveButtonDisabled: {
    backgroundColor: '#007AFF',
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});