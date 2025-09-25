import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addCategory } from '../store/slices/taskSlice';

export default function CategoriesScreen() {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.tasks);
  const { theme } = useSelector(state => state.settings);
  const isDark = theme === 'dark';
  
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    
    if (categories.includes(newCategory.trim())) {
      Alert.alert('Error', 'This category already exists');
      return;
    }
    
    dispatch(addCategory(newCategory.trim()));
    setNewCategory('');
    setIsAdding(false);
  };

  const categoryIcons = {
    Personal: 'person',
    Work: 'briefcase',
    Study: 'school',
    Health: 'fitness',
    Shopping: 'bag',
    Travel: 'airplane',
    Finance: 'card',
    Home: 'home',
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Manage Categories
          </Text>
          <Text style={[styles.sectionSubtitle, isDark && styles.sectionSubtitleDark]}>
            Organize your tasks by creating custom categories
          </Text>
        </View>

        {/* Categories List */}
        <View style={[styles.categoriesContainer, isDark && styles.categoriesContainerDark]}>
          {categories.map((category, index) => (
            <View key={index} style={[styles.categoryItem, isDark && styles.categoryItemDark]}>
              <View style={styles.categoryLeft}>
                <Ionicons
                  name={categoryIcons[category] || 'folder'}
                  size={24}
                  color="#007AFF"
                />
                <Text style={[styles.categoryName, isDark && styles.categoryNameDark]}>
                  {category}
                </Text>
              </View>
              <TouchableOpacity style={styles.categoryAction}>
                <Ionicons name="ellipsis-horizontal" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
              </TouchableOpacity>
            </View>
          ))}
          
          {/* Add New Category */}
          {isAdding ? (
            <View style={[styles.categoryItem, styles.addingItem, isDark && styles.categoryItemDark]}>
              <View style={styles.categoryLeft}>
                <Ionicons name="folder" size={24} color="#007AFF" />
                <TextInput
                  style={[styles.categoryInput, isDark && styles.categoryInputDark]}
                  placeholder="Category name"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  onSubmitEditing={handleAddCategory}
                  autoFocus
                />
              </View>
              <View style={styles.addingActions}>
                <TouchableOpacity onPress={() => setIsAdding(false)} style={styles.actionButton}>
                  <Ionicons name="close" size={20} color="#FF3B30" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddCategory} style={styles.actionButton}>
                  <Ionicons name="checkmark" size={20} color="#34C759" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addButton, isDark && styles.addButtonDark]}
              onPress={() => setIsAdding(true)}
            >
              <Ionicons name="add" size={24} color="#007AFF" />
              <Text style={[styles.addButtonText, isDark && styles.addButtonTextDark]}>
                Add New Category
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Predefined Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Suggested Categories
          </Text>
          <View style={styles.suggestedGrid}>
            {['Travel', 'Finance', 'Home', 'Social', 'Hobby', 'Learning'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.suggestedItem, isDark && styles.suggestedItemDark]}
                onPress={() => {
                  if (!categories.includes(category)) {
                    dispatch(addCategory(category));
                  }
                }}
                disabled={categories.includes(category)}
              >
                <Ionicons
                  name={categoryIcons[category] || 'folder'}
                  size={20}
                  color={categories.includes(category) ? '#8E8E93' : '#007AFF'}
                />
                <Text style={[
                  styles.suggestedText,
                  isDark && styles.suggestedTextDark,
                  categories.includes(category) && styles.suggestedTextDisabled
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  sectionSubtitleDark: {
    color: '#8E8E93',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoriesContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  categoryItemDark: {
    borderBottomColor: '#2C2C2E',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 16,
  },
  categoryNameDark: {
    color: '#FFFFFF',
  },
  categoryAction: {
    padding: 4,
  },
  addingItem: {
    borderBottomWidth: 0,
  },
  categoryInput: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 16,
    flex: 1,
  },
  categoryInputDark: {
    color: '#FFFFFF',
  },
  addingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addButtonDark: {
    // Dark theme styles
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 16,
  },
  addButtonTextDark: {
    color: '#007AFF',
  },
  suggestedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestedItemDark: {
    backgroundColor: '#1C1C1E',
  },
  suggestedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
  suggestedTextDark: {
    color: '#007AFF',
  },
  suggestedTextDisabled: {
    color: '#8E8E93',
  },
});