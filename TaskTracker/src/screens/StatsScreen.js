import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SimplePieChart from '../components/SimplePieChart';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const { tasks } = useSelector(state => state.tasks);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Priority distribution
  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  // Category distribution
  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  // Lightweight chart data

  const pieData = [
    {
      name: 'Completed',
      value: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      color: '#34C759',
    },
    {
      name: 'Active',
      value: totalTasks > 0 ? Math.round((activeTasks / totalTasks) * 100) : 0,
      color: '#007AFF',
    },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Overview
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons name="list" size={24} color="#007AFF" />
              <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>
                {totalTasks}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Total Tasks
              </Text>
            </View>
            
            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>
                {completedTasks}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Completed
              </Text>
            </View>
            
            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons name="time" size={24} color="#FF9500" />
              <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>
                {activeTasks}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Active
              </Text>
            </View>
            
            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons name="trending-up" size={24} color="#007AFF" />
              <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>
                {Math.round(completionRate)}%
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Completion
              </Text>
            </View>
          </View>
        </View>

        {/* Completion Chart */}
        {totalTasks > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
              Task Distribution
            </Text>
            <View style={[styles.chartContainer, isDark && styles.chartContainerDark]}>
              <SimplePieChart data={pieData} size={200} isDark={isDark} />
            </View>
          </View>
        )}

        {/* Priority Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Priority Breakdown
          </Text>
          <View style={[styles.listContainer, isDark && styles.listContainerDark]}>
            {Object.entries(priorityStats).map(([priority, count]) => (
              <View key={priority} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View
                    style={[
                      styles.priorityDot,
                      {
                        backgroundColor: priority === 'urgent' ? '#FF3B30' :
                                       priority === 'high' ? '#FF9500' :
                                       priority === 'medium' ? '#FFCC02' : '#34C759'
                      }
                    ]}
                  />
                  <Text style={[styles.listItemTitle, isDark && styles.listItemTitleDark]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={[styles.listItemCount, isDark && styles.listItemCountDark]}>
                    {count}
                  </Text>
                  <Text style={[styles.listItemPercentage, isDark && styles.listItemPercentageDark]}>
                    {totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Category Breakdown
          </Text>
          <View style={[styles.listContainer, isDark && styles.listContainerDark]}>
            {Object.entries(categoryStats).map(([category, count]) => (
              <View key={category} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Ionicons name="folder" size={16} color="#007AFF" />
                  <Text style={[styles.listItemTitle, isDark && styles.listItemTitleDark]}>
                    {category}
                  </Text>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={[styles.listItemCount, isDark && styles.listItemCountDark]}>
                    {count}
                  </Text>
                  <Text style={[styles.listItemPercentage, isDark && styles.listItemPercentageDark]}>
                    {totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Productivity Tips */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Productivity Insights
          </Text>
          <View style={[styles.tipCard, isDark && styles.tipCardDark]}>
            <Ionicons name="bulb" size={24} color="#FFCC02" />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, isDark && styles.tipTitleDark]}>
                Keep it up! 
              </Text>
              <Text style={[styles.tipText, isDark && styles.tipTextDark]}>
                {completionRate > 70 
                  ? "You're doing great! Your completion rate is excellent."
                  : completionRate > 50
                  ? "Good progress! Try to complete a few more tasks today."
                  : "Let's focus on completing some tasks to build momentum."
                }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (screenWidth - 76) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardDark: {
    backgroundColor: '#1C1C1E',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
  },
  statNumberDark: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  statLabelDark: {
    color: '#8E8E93',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 12,
  },
  listItemTitleDark: {
    color: '#FFFFFF',
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  listItemCountDark: {
    color: '#FFFFFF',
  },
  listItemPercentage: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  listItemPercentageDark: {
    color: '#8E8E93',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipCardDark: {
    backgroundColor: '#1C1C1E',
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  tipTitleDark: {
    color: '#FFFFFF',
  },
  tipText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  tipTextDark: {
    color: '#8E8E93',
  },
});