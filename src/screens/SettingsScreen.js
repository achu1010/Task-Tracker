import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setTheme } from '../store/slices/settingsSlice';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { theme, notifications, view, productivity } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    dispatch(setTheme(isDark ? 'light' : 'dark'));
  };

  const SettingItem = ({ title, subtitle, rightComponent, onPress }) => (
    <TouchableOpacity
      style={[styles.settingItem, isDark && styles.settingItemDark]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, isDark && styles.settingTitleDark]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, isDark && styles.settingSubtitleDark]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Appearance</Text>
          <View style={[styles.sectionContainer, isDark && styles.sectionContainerDark]}>
            <SettingItem
              title="Dark Mode"
              subtitle="Switch between light and dark themes"
              rightComponent={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Notifications</Text>
          <View style={[styles.sectionContainer, isDark && styles.sectionContainerDark]}>
            <SettingItem
              title="Push Notifications"
              subtitle="Receive reminders and updates"
              rightComponent={
                <Switch
                  value={notifications.enabled}
                  onValueChange={() => {}}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={notifications.enabled ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
            <SettingItem
              title="Reminder Sound"
              subtitle="Play sound for reminders"
              rightComponent={
                <Switch
                  value={notifications.sound}
                  onValueChange={() => {}}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={notifications.sound ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
          </View>
        </View>

        {/* View Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>View</Text>
          <View style={[styles.sectionContainer, isDark && styles.sectionContainerDark]}>
            <SettingItem
              title="Show Completed Tasks"
              subtitle="Display completed tasks in lists"
              rightComponent={
                <Switch
                  value={view.showCompleted}
                  onValueChange={() => {}}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={view.showCompleted ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
            <SettingItem
              title="Compact Mode"
              subtitle="Show more tasks in less space"
              rightComponent={
                <Switch
                  value={view.compactMode}
                  onValueChange={() => {}}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={view.compactMode ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
          </View>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Data & Privacy</Text>
          <View style={[styles.sectionContainer, isDark && styles.sectionContainerDark]}>
            <SettingItem
              title="Export Data"
              subtitle="Download your tasks as CSV"
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
              }
              onPress={() => {}}
            />
            <SettingItem
              title="Clear All Data"
              subtitle="Reset all tasks and settings"
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
              }
              onPress={() => {}}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>About</Text>
          <View style={[styles.sectionContainer, isDark && styles.sectionContainerDark]}>
            <SettingItem
              title="Version"
              subtitle="2.0.0"
              rightComponent={null}
            />
            <SettingItem
              title="Help & Support"
              subtitle="Get help with TaskTracker"
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
              }
              onPress={() => {}}
            />
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingItemDark: {
    borderBottomColor: '#2C2C2E',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  settingTitleDark: {
    color: '#FFFFFF',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  settingSubtitleDark: {
    color: '#8E8E93',
  },
});