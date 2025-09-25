import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../store/slices/userSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  const menuItems = [
    { title: 'Settings', icon: 'settings', onPress: () => navigation.navigate('Settings') },
    { title: 'Categories', icon: 'folder', onPress: () => navigation.navigate('Categories') },
    { title: 'Export Data', icon: 'download', onPress: () => {} },
    { title: 'Help & Support', icon: 'help-circle', onPress: () => {} },
    { title: 'About', icon: 'information-circle', onPress: () => {} },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={isDark ? '#FFFFFF' : '#007AFF'} />
          </View>
          <Text style={[styles.name, isDark && styles.nameDark]}>
            {currentUser?.name || 'TaskTracker User'}
          </Text>
          <Text style={[styles.email, isDark && styles.emailDark]}>
            {currentUser?.email || 'user@tasktracker.com'}
          </Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, isDark && styles.statsContainerDark]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>150</Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Tasks</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>7</Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>1,250</Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Points</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isDark && styles.menuItemDark]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={isDark ? '#FFFFFF' : '#007AFF'} />
                <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
          onPress={() => dispatch(logout())}
        >
          <Ionicons name="log-out" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  nameDark: {
    color: '#FFFFFF',
  },
  email: {
    fontSize: 16,
    color: '#8E8E93',
  },
  emailDark: {
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statNumberDark: {
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statLabelDark: {
    color: '#8E8E93',
  },
  menuContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItemDark: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 16,
  },
  menuItemTextDark: {
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonDark: {
    backgroundColor: '#1C1C1E',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
});