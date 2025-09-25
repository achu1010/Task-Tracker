import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetailScreen({ route }) {
  const { task } = route.params;
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={[styles.title, isDark && styles.titleDark]}>{task.title}</Text>
          {task.description && (
            <Text style={[styles.description, isDark && styles.descriptionDark]}>
              {task.description}
            </Text>
          )}
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Details</Text>
            <View style={[styles.detailItem, isDark && styles.detailItemDark]}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Category:</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>{task.category}</Text>
            </View>
            <View style={[styles.detailItem, isDark && styles.detailItemDark]}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Priority:</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>{task.priority}</Text>
            </View>
            {task.dueDate && (
              <View style={[styles.detailItem, isDark && styles.detailItemDark]}>
                <Text style={[styles.label, isDark && styles.labelDark]}>Due Date:</Text>
                <Text style={[styles.value, isDark && styles.valueDark]}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              </View>
            )}
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 24,
  },
  descriptionDark: {
    color: '#8E8E93',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  detailItemDark: {
    borderBottomColor: '#38383A',
  },
  label: {
    fontSize: 16,
    color: '#8E8E93',
  },
  labelDark: {
    color: '#8E8E93',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textTransform: 'capitalize',
  },
  valueDark: {
    color: '#FFFFFF',
  },
});