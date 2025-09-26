import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
  SafeAreaView,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import {
  addTask,
  setSearchQuery,
  setSortBy,
  setFilterBy,
  deleteTask,
  toggleTaskComplete,
  reorderTasks,
} from '../store/slices/taskSlice';
import Colors from '../constants/Colors';
import TaskListItem from '../components/TaskListItem';
import FloatingActionButton from '../components/FloatingActionButton';
import FilterBar from '../components/FilterBar';
import QuickAddTask from '../components/QuickAddTask';
import TaskFormModal from '../components/TaskFormModal';

const { width } = Dimensions.get('window');

// Create a dummy data for lists (categories)
const LISTS = [
  { id: 'all', name: 'All Lists', icon: 'home' },
  { id: 'default', name: 'Default', icon: 'list' },
  { id: 'personal', name: 'Personal', icon: 'list' },
  { id: 'shopping', name: 'Shopping', icon: 'list' },
  { id: 'wishlist', name: 'Wishlist', icon: 'list' },
  { id: 'work', name: 'Work', icon: 'list' },
  { id: 'finished', name: 'Finished', icon: 'checkmark-circle' },
];

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { tasks, searchQuery, sortBy, sortOrder, filterBy } = useSelector(state => state.tasks);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';
  
  const [quickTask, setQuickTask] = useState('');
  const [isListsVisible, setIsListsVisible] = useState(false);
  const [selectedList, setSelectedList] = useState('all');

  const [refreshing, setRefreshing] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  
  // Filter and group tasks by date
  const groupedTasks = React.useMemo(() => {
    // First, filter tasks according to the selected list
    let filtered = tasks;
    
    if (selectedList === 'finished') {
      filtered = tasks.filter(task => task.completed);
    } else if (selectedList !== 'all') {
      filtered = tasks.filter(task => {
        // Convert category to lowercase and remove spaces for comparison
        const category = task.category ? 
          task.category.toLowerCase().replace(/\s+/g, '') : 'default';
        return category === selectedList;
      });
    }
    
    // Filter by search query if present
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply priority filter if set
    if (filterBy && filterBy.priority) {
      filtered = filtered.filter(task => task.priority === filterBy.priority);
    }
    
    // Apply completion filter if set
    if (filterBy && filterBy.completed !== undefined) {
      filtered = filtered.filter(task => task.completed === filterBy.completed);
    }
    
    // Apply due today filter if set
    if (filterBy && filterBy.dueToday) {
      const today = new Date().toDateString();
      filtered = filtered.filter(task => {
        const taskDate = task.dueDate ? new Date(task.dueDate).toDateString() : null;
        return taskDate === today;
      });
    }
    
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
          comparison = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          break;
        case 'createdAt':
        default:
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Group tasks by date category
    const grouped = {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
      noDueDate: []
    };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    filtered.forEach(task => {
      if (!task.dueDate) {
        grouped.noDueDate.push(task);
      } else {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today && !task.completed) {
          grouped.overdue.push(task);
        } else if (dueDate.getTime() === today.getTime()) {
          grouped.today.push(task);
        } else if (dueDate.getTime() === tomorrow.getTime()) {
          grouped.tomorrow.push(task);
        } else {
          grouped.upcoming.push(task);
        }
      }
    });
    
    return grouped;
  }, [tasks, searchQuery, sortBy, sortOrder, filterBy, selectedList]);

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
  
  const handleSort = () => {
    Alert.alert(
      'Sort Tasks',
      'Choose sorting option',
      [
        { text: 'Created Date', onPress: () => dispatch(setSortBy({ sortBy: 'createdAt', sortOrder: sortOrder })) },
        { text: 'Due Date', onPress: () => dispatch(setSortBy({ sortBy: 'dueDate', sortOrder: sortOrder })) },
        { text: 'Priority', onPress: () => dispatch(setSortBy({ sortBy: 'priority', sortOrder: sortOrder })) },
        { text: 'Title', onPress: () => dispatch(setSortBy({ sortBy: 'title', sortOrder: sortOrder })) },
        { text: 'Toggle Order', onPress: () => dispatch(setSortBy({ sortBy: sortBy, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Remove TaskCard component as we're now using TaskListItem

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
            <Text style={styles.welcomeText}>Welcome Back! Good {getTimeOfDay()}!</Text>
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

      {/* Categories List */}
      <View style={styles.categoriesRow}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {LISTS.map((list) => (
            <TouchableOpacity 
              key={list.id}
              style={[
                styles.categoryButton,
                selectedList === list.id && styles.selectedCategory,
                isDark && styles.categoryButtonDark,
                selectedList === list.id && isDark && styles.selectedCategoryDark
              ]}
              onPress={() => setSelectedList(list.id)}
            >
              <Ionicons 
                name={list.icon} 
                size={18} 
                color={selectedList === list.id 
                  ? (isDark ? '#FFFFFF' : '#FFFFFF')
                  : (isDark ? '#A8A8A8' : '#696969')}
                style={styles.categoryIcon}
              />
              <Text 
                style={[
                  styles.categoryText,
                  selectedList === list.id && styles.selectedCategoryText,
                  isDark && styles.categoryTextDark,
                  selectedList === list.id && isDark && styles.selectedCategoryTextDark
                ]}
              >
                {list.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Task Lists */}
      <ScrollView
        style={styles.taskList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#FFFFFF' : Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Check if there are any tasks after filtering */}
        {Object.values(groupedTasks).every(group => group.length === 0) ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="checkmark-circle-outline" 
              size={80} 
              color={isDark ? '#8E8E93' : '#C7C7CC'} 
            />
            <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>
              {searchQuery || Object.keys(filterBy).length > 0 || selectedList !== 'all'
                ? 'No tasks match your filters' 
                : 'No tasks yet! Add your first task below.'}
            </Text>
          </View>
        ) : (
          <View style={styles.taskContainer}>
            {/* Overdue Tasks */}
            {groupedTasks.overdue.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                  <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>Overdue</Text>
                  <Text style={styles.taskCount}>{groupedTasks.overdue.length}</Text>
                </View>
                {groupedTasks.overdue.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task)}
                    onComplete={() => handleTaskComplete(task.id)}
                    onDelete={() => handleTaskDelete(task.id)}
                  />
                ))}
              </View>
            )}

            {/* Today's Tasks */}
            {groupedTasks.today.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="today" size={20} color={Colors.primary} />
                  <Text style={[styles.sectionTitle, { color: Colors.primary }]}>Today</Text>
                  <Text style={styles.taskCount}>{groupedTasks.today.length}</Text>
                </View>
                {groupedTasks.today.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task)}
                    onComplete={() => handleTaskComplete(task.id)}
                    onDelete={() => handleTaskDelete(task.id)}
                  />
                ))}
              </View>
            )}

            {/* Tomorrow's Tasks */}
            {groupedTasks.tomorrow.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                  <Text style={[styles.sectionTitle, { color: '#007AFF' }]}>Tomorrow</Text>
                  <Text style={styles.taskCount}>{groupedTasks.tomorrow.length}</Text>
                </View>
                {groupedTasks.tomorrow.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task)}
                    onComplete={() => handleTaskComplete(task.id)}
                    onDelete={() => handleTaskDelete(task.id)}
                  />
                ))}
              </View>
            )}

            {/* Upcoming Tasks */}
            {groupedTasks.upcoming.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="time-outline" size={20} color="#5856D6" />
                  <Text style={[styles.sectionTitle, { color: '#5856D6' }]}>Upcoming</Text>
                  <Text style={styles.taskCount}>{groupedTasks.upcoming.length}</Text>
                </View>
                {groupedTasks.upcoming.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task)}
                    onComplete={() => handleTaskComplete(task.id)}
                    onDelete={() => handleTaskDelete(task.id)}
                  />
                ))}
              </View>
            )}

            {/* No Due Date Tasks */}
            {groupedTasks.noDueDate.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="infinite-outline" size={20} color="#8E8E93" />
                  <Text style={[styles.sectionTitle, { color: '#8E8E93' }]}>No Due Date</Text>
                  <Text style={styles.taskCount}>{groupedTasks.noDueDate.length}</Text>
                </View>
                {groupedTasks.noDueDate.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task)}
                    onComplete={() => handleTaskComplete(task.id)}
                    onDelete={() => handleTaskDelete(task.id)}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Add some bottom padding for FAB */}
        <View style={styles.fabBottomSpace} />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() => setIsTaskModalVisible(true)}
        icon="add"
      />
      
      {/* Task Form Modal */}
      <TaskFormModal
        visible={isTaskModalVisible}
        onClose={() => setIsTaskModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  profileButton: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: 35,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainerDark: {
    backgroundColor: '#2C2C2E',
    shadowColor: '#000',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    height: 36,
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  categoriesRow: {
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
  },
  selectedCategoryDark: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#696969',
  },
  categoryTextDark: {
    color: '#A8A8A8',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedCategoryTextDark: {
    color: '#FFFFFF',
  },
  taskList: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  taskContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  emptyStateTextDark: {
    color: '#8E8E93',
  },
  fabBottomSpace: {
    height: 80,
  },
});

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}