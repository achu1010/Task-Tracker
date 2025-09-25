import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import {
  setSearchQuery,
  setSortBy,
  setFilterBy,
  deleteTask,
  toggleTaskComplete,
  reorderTasks,
} from '../store/slices/taskSlice';
import TaskCard from '../components/TaskCard';
import QuickAddTask from '../components/QuickAddTask';
import FilterBar from '../components/FilterBar';
import FloatingActionButton from '../components/FloatingActionButton';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { tasks, searchQuery, sortBy, sortOrder, filterBy } = useSelector(state => state.tasks);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', 'compact'

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks.filter(task => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filterBy.category && task.category !== filterBy.category) {
        return false;
      }
      
      // Priority filter
      if (filterBy.priority && task.priority !== filterBy.priority) {
        return false;
      }
      
      // Completion filter
      if (filterBy.completed !== undefined && task.completed !== filterBy.completed) {
        return false;
      }
      
      // Due today filter
      if (filterBy.dueToday) {
        const today = new Date().toDateString();
        const taskDate = task.dueDate ? new Date(task.dueDate).toDateString() : null;
        if (taskDate !== today) {
          return false;
        }
      }
      
      return true;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'createdAt':
        default:
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [tasks, searchQuery, sortBy, sortOrder, filterBy]);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleTaskPress = (task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('TaskDetail', { task });
  };

  const handleTaskComplete = (taskId) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(toggleTaskComplete(taskId));
  };

  const handleTaskDelete = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            dispatch(deleteTask(taskId));
          },
        },
      ]
    );
  };

  const renderTask = (item, index) => {
    return (
      <TaskCard
        key={item.id}
        task={item}
        onPress={() => handleTaskPress(item)}
        onComplete={() => handleTaskComplete(item.id)}
        onDelete={() => handleTaskDelete(item.id)}
        style={{ marginBottom: 12 }}
      />
    );
  };

  const handleSort = () => {
    Alert.alert(
      'Sort Tasks',
      'Choose sorting option',
      [
        { text: 'Created Date', onPress: () => dispatch(setSortBy({ sortBy: 'createdAt', sortOrder })) },
        { text: 'Due Date', onPress: () => dispatch(setSortBy({ sortBy: 'dueDate', sortOrder })) },
        { text: 'Priority', onPress: () => dispatch(setSortBy({ sortBy: 'priority', sortOrder })) },
        { text: 'Title', onPress: () => dispatch(setSortBy({ sortBy: 'title', sortOrder })) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header with Stats */}
      <LinearGradient
        colors={isDark ? ['#1C1C1E', '#2C2C2E'] : ['#007AFF', '#0056CC']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Good {getTimeOfDay()}!</Text>
            <Text style={styles.statsText}>
              {completedCount} of {totalCount} tasks completed
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${completionPercentage}%` }]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(completionPercentage)}%</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
        <Ionicons name="search" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search tasks..."
          placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(setSearchQuery(''))}>
            <Ionicons name="close-circle" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter and Sort Bar */}
      <FilterBar onSort={handleSort} />

      {/* Quick Add Task */}
      <QuickAddTask />

      {/* Task List */}
      <ScrollView
        style={styles.taskList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#FFFFFF' : '#007AFF'}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="checkmark-circle-outline" 
              size={80} 
              color={isDark ? '#8E8E93' : '#C7C7CC'} 
            />
            <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>
              {searchQuery || Object.keys(filterBy).length > 0 
                ? 'No tasks match your filters' 
                : 'No tasks yet! Add your first task below.'}
            </Text>
          </View>
        ) : (
          <View style={styles.taskContainer}>
            {filteredTasks.map((task, index) => renderTask(task, index))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() => navigation.navigate('AddTask')}
        icon="add"
      />
    </View>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskContainer: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  emptyStateTextDark: {
    color: '#8E8E93',
  },
});