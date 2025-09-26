import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setFilterBy, setSortBy } from '../store/slices/taskSlice';

export default function FilterBar({ onSort }) {
  const dispatch = useDispatch();
  const { categories, filterBy, sortBy, sortOrder } = useSelector(state => state.tasks);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';

  const [showFilterModal, setShowFilterModal] = useState(false);

  const priorities = ['low', 'medium', 'high', 'urgent'];

  const handleFilterChange = (key, value) => {
    const newFilter = { ...filterBy };
    if (newFilter[key] === value) {
      delete newFilter[key]; // Remove filter if same value is selected
    } else {
      newFilter[key] = value;
    }
    dispatch(setFilterBy(newFilter));
  };

  const clearAllFilters = () => {
    dispatch(setFilterBy({}));
  };

  const getActiveFilterCount = () => {
    return Object.keys(filterBy).length;
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'dueDate': return 'calendar';
      case 'priority': return 'flag';
      case 'title': return 'text';
      case 'createdAt': return 'time';
      default: return 'funnel';
    }
  };

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilterModal(false)}>
            <Text style={[styles.modalButton, isDark && styles.modalButtonDark]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>Filters & Sort</Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={[styles.modalButton, styles.clearButton]}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Sort Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Sort By</Text>
            <View style={styles.optionGrid}>
              {[
                { key: 'createdAt', label: 'Created Date', icon: 'time' },
                { key: 'dueDate', label: 'Due Date', icon: 'calendar' },
                { key: 'priority', label: 'Priority', icon: 'flag' },
                { key: 'title', label: 'Title', icon: 'text' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    isDark && styles.optionButtonDark,
                    sortBy === option.key && styles.optionButtonActive,
                  ]}
                  onPress={() => {
                    const newOrder = sortBy === option.key && sortOrder === 'desc' ? 'asc' : 'desc';
                    dispatch(setSortBy({ sortBy: option.key, sortOrder: newOrder }));
                  }}
                >
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={sortBy === option.key ? '#FFFFFF' : (isDark ? '#007AFF' : '#007AFF')}
                  />
                  <Text style={[
                    styles.optionText,
                    isDark && styles.optionTextDark,
                    sortBy === option.key && styles.optionTextActive,
                  ]}>
                    {option.label}
                  </Text>
                  {sortBy === option.key && (
                    <Ionicons
                      name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                      size={16}
                      color="#FFFFFF"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Category</Text>
            <View style={styles.optionGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.optionButton,
                    isDark && styles.optionButtonDark,
                    filterBy.category === category && styles.optionButtonActive,
                  ]}
                  onPress={() => handleFilterChange('category', category)}
                >
                  <Text style={[
                    styles.optionText,
                    isDark && styles.optionTextDark,
                    filterBy.category === category && styles.optionTextActive,
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Priority Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Priority</Text>
            <View style={styles.optionGrid}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.optionButton,
                    isDark && styles.optionButtonDark,
                    filterBy.priority === priority && styles.optionButtonActive,
                  ]}
                  onPress={() => handleFilterChange('priority', priority)}
                >
                  <Text style={[
                    styles.optionText,
                    isDark && styles.optionTextDark,
                    filterBy.priority === priority && styles.optionTextActive,
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Status</Text>
            <View style={styles.optionGrid}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isDark && styles.optionButtonDark,
                  filterBy.completed === false && styles.optionButtonActive,
                ]}
                onPress={() => handleFilterChange('completed', false)}
              >
                <Text style={[
                  styles.optionText,
                  isDark && styles.optionTextDark,
                  filterBy.completed === false && styles.optionTextActive,
                ]}>
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isDark && styles.optionButtonDark,
                  filterBy.completed === true && styles.optionButtonActive,
                ]}
                onPress={() => handleFilterChange('completed', true)}
              >
                <Text style={[
                  styles.optionText,
                  isDark && styles.optionTextDark,
                  filterBy.completed === true && styles.optionTextActive,
                ]}>
                  Completed
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Filters */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Quick Filters</Text>
            <View style={styles.optionGrid}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isDark && styles.optionButtonDark,
                  filterBy.dueToday && styles.optionButtonActive,
                ]}
                onPress={() => handleFilterChange('dueToday', true)}
              >
                <Ionicons
                  name="today"
                  size={20}
                  color={filterBy.dueToday ? '#FFFFFF' : (isDark ? '#007AFF' : '#007AFF')}
                />
                <Text style={[
                  styles.optionText,
                  isDark && styles.optionTextDark,
                  filterBy.dueToday && styles.optionTextActive,
                ]}>
                  Due Today
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {/* Filter Button */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              isDark && styles.filterButtonDark,
              getActiveFilterCount() > 0 && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons
              name="funnel"
              size={16}
              color={getActiveFilterCount() > 0 ? '#FFFFFF' : (isDark ? '#007AFF' : '#007AFF')}
            />
            <Text style={[
              styles.filterButtonText,
              isDark && styles.filterButtonTextDark,
              getActiveFilterCount() > 0 && styles.filterButtonTextActive,
            ]}>
              Filter
            </Text>
            {getActiveFilterCount() > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getActiveFilterCount()}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Sort Button */}
          <TouchableOpacity
            style={[styles.filterButton, isDark && styles.filterButtonDark]}
            onPress={onSort}
          >
            <Ionicons
              name={getSortIcon()}
              size={16}
              color={isDark ? '#007AFF' : '#007AFF'}
            />
            <Text style={[styles.filterButtonText, isDark && styles.filterButtonTextDark]}>
              Sort
            </Text>
            <Ionicons
              name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={isDark ? '#8E8E93' : '#8E8E93'}
            />
          </TouchableOpacity>

          {/* Active Filter Chips */}
          {Object.entries(filterBy).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[styles.activeFilter, isDark && styles.activeFilterDark]}
              onPress={() => handleFilterChange(key, value)}
            >
              <Text style={[styles.activeFilterText, isDark && styles.activeFilterTextDark]}>
                {key === 'completed' ? (value ? 'Completed' : 'Active') :
                 key === 'dueToday' ? 'Due Today' :
                 typeof value === 'string' ? value : String(value)}
              </Text>
              <Ionicons name="close" size={14} color={isDark ? '#8E8E93' : '#8E8E93'} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FilterModal />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  filterBar: {
    paddingHorizontal: 0,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  filterButtonTextDark: {
    color: '#007AFF',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#007AFF',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterDark: {
    backgroundColor: '#3A3A3C',
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  activeFilterTextDark: {
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalContainerDark: {
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  modalButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalButtonDark: {
    color: '#007AFF',
  },
  clearButton: {
    color: '#FF3B30',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  optionButtonDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  optionTextDark: {
    color: '#FFFFFF',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});