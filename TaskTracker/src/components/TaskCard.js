import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function TaskCard({ task, onPress, onComplete, onDelete, style }) {
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';
  
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#FF3B30';
      case 'high': return '#FF9500';
      case 'medium': return '#FFCC02';
      case 'low': return '#34C759';
      default: return '#007AFF';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'alert-circle';
      case 'high': return 'arrow-up-circle';
      case 'medium': return 'remove-circle';
      case 'low': return 'arrow-down-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
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

  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && !task.completed;
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const hasSubtasks = totalSubtasks > 0;

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      
      // Scale down slightly when swiping
      const progress = Math.abs(event.translationX) / 100;
      scale.value = 1 - Math.min(progress * 0.05, 0.05);
    },
    onEnd: (event) => {
      const shouldComplete = event.translationX > 100;
      const shouldDelete = event.translationX < -100;
      
      if (shouldComplete) {
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
        runOnJS(onComplete)();
        opacity.value = withSpring(0.5);
      } else if (shouldDelete) {
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Warning);
        runOnJS(onDelete)();
      }
      
      translateX.value = withSpring(0);
      scale.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const swipeIndicatorStyle = useAnimatedStyle(() => {
    const rightOpacity = translateX.value > 50 ? (translateX.value - 50) / 50 : 0;
    const leftOpacity = translateX.value < -50 ? Math.abs(translateX.value + 50) / 50 : 0;
    
    return {
      opacity: Math.max(rightOpacity, leftOpacity),
    };
  });

  return (
    <View style={[styles.container, style]}>
      {/* Swipe Actions Background */}
      <Animated.View style={[styles.swipeBackground, swipeIndicatorStyle]}>
        <View style={styles.swipeAction}>
          <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          <Text style={styles.swipeActionText}>Complete</Text>
        </View>
        <View style={[styles.swipeAction, styles.deleteAction]}>
          <Ionicons name="trash" size={24} color="#FFFFFF" />
          <Text style={styles.swipeActionText}>Delete</Text>
        </View>
      </Animated.View>

      {/* Task Card */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity
            style={[
              styles.taskCard,
              isDark && styles.taskCardDark,
              task.completed && styles.taskCardCompleted,
              isOverdue() && styles.taskCardOverdue,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
          >
            {/* Priority Indicator */}
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}
            />

            {/* Task Content */}
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <View style={styles.taskInfo}>
                  <Text
                    style={[
                      styles.taskTitle,
                      isDark && styles.taskTitleDark,
                      task.completed && styles.taskTitleCompleted,
                    ]}
                    numberOfLines={2}
                  >
                    {task.title}
                  </Text>
                  
                  {task.description && (
                    <Text
                      style={[
                        styles.taskDescription,
                        isDark && styles.taskDescriptionDark,
                        task.completed && styles.taskDescriptionCompleted,
                      ]}
                      numberOfLines={1}
                    >
                      {task.description}
                    </Text>
                  )}
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    task.completed && styles.completeButtonCompleted,
                  ]}
                  onPress={onComplete}
                >
                  <Ionicons
                    name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={task.completed ? "#34C759" : (isDark ? "#8E8E93" : "#C7C7CC")}
                  />
                </TouchableOpacity>
              </View>

              {/* Task Meta Information */}
              <View style={styles.taskMeta}>
                <View style={styles.taskMetaLeft}>
                  {/* Category */}
                  <View style={[styles.categoryTag, isDark && styles.categoryTagDark]}>
                    <Text style={[styles.categoryText, isDark && styles.categoryTextDark]}>
                      {task.category}
                    </Text>
                  </View>

                  {/* Priority */}
                  <View style={styles.priorityTag}>
                    <Ionicons
                      name={getPriorityIcon(task.priority)}
                      size={12}
                      color={getPriorityColor(task.priority)}
                    />
                    <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                      {task.priority}
                    </Text>
                  </View>
                </View>

                <View style={styles.taskMetaRight}>
                  {/* Subtasks Progress */}
                  {hasSubtasks && (
                    <View style={styles.subtaskProgress}>
                      <Ionicons name="list" size={12} color={isDark ? "#8E8E93" : "#8E8E93"} />
                      <Text style={[styles.subtaskText, isDark && styles.subtaskTextDark]}>
                        {completedSubtasks}/{totalSubtasks}
                      </Text>
                    </View>
                  )}

                  {/* Due Date */}
                  {task.dueDate && (
                    <View style={styles.dueDateContainer}>
                      <Ionicons
                        name="time"
                        size={12}
                        color={isOverdue() ? "#FF3B30" : (isDark ? "#8E8E93" : "#8E8E93")}
                      />
                      <Text
                        style={[
                          styles.dueDateText,
                          isDark && styles.dueDateTextDark,
                          isOverdue() && styles.overdueDateText,
                        ]}
                      >
                        {formatDate(task.dueDate)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {task.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={[styles.tag, isDark && styles.tagDark]}>
                      <Text style={[styles.tagText, isDark && styles.tagTextDark]}>
                        #{tag}
                      </Text>
                    </View>
                  ))}
                  {task.tags.length > 3 && (
                    <Text style={[styles.moreTagsText, isDark && styles.moreTagsTextDark]}>
                      +{task.tags.length - 3} more
                    </Text>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  swipeBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swipeAction: {
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
  },
  taskCardDark: {
    backgroundColor: '#1C1C1E',
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskCardOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  priorityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  taskDescriptionDark: {
    color: '#8E8E93',
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  completeButton: {
    padding: 4,
  },
  completeButtonCompleted: {
    // Additional styles for completed state
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryTagDark: {
    backgroundColor: '#2C2C2E',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  categoryTextDark: {
    color: '#007AFF',
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
    textTransform: 'capitalize',
  },
  subtaskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  subtaskText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 2,
  },
  subtaskTextDark: {
    color: '#8E8E93',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 2,
  },
  dueDateTextDark: {
    color: '#8E8E93',
  },
  overdueDateText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginTop: 4,
  },
  tagDark: {
    backgroundColor: '#3A3A3C',
  },
  tagText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '500',
  },
  tagTextDark: {
    color: '#007AFF',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 4,
  },
  moreTagsTextDark: {
    color: '#8E8E93',
  },
});