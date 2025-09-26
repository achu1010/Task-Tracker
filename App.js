import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = React.useState('');
  const [taskList, setTaskList] = React.useState([]); // [{id, text, completed}]

  // Load tasks
  React.useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('tasks');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Backwards compatibility if old format (array of strings)
            const normalized = Array.isArray(parsed)
              ? parsed.map((t, i) => typeof t === 'string' ? ({ id: Date.now() + '-' + i, text: t, completed: false }) : t)
              : [];
          setTaskList(normalized);
        }
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    })();
  }, []);

  // Save tasks
  React.useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(taskList)).catch(e => console.error('Save error', e));
  }, [taskList]);

  const handleAddTask = () => {
    if (!task.trim()) return;
    setTaskList(prev => [
      { id: Date.now().toString(), text: task.trim(), completed: false },
      ...prev,
    ]);
    setTask('');
  };

  const toggleComplete = (id) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTaskList(prev => prev.filter(t => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Task Tracker</Text>
      <Text style={styles.subtext}>Track your tasks efficiently!</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={task}
            onChangeText={setTask}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList}>
        {taskList.map(item => (
          <View key={item.id} style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>            
            <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.iconTouchable}>
              <Text style={[styles.icon, item.completed && styles.iconCompleted]}>{item.completed ? '✔' : '○'}</Text>
            </TouchableOpacity>

            <Text
              style={[styles.taskText, item.completed && styles.taskTextCompleted]}
              numberOfLines={3}
            >{item.text}</Text>

            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.iconTouchable}>
              <Text style={[styles.icon, styles.deleteIcon]}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 20, paddingTop: 50 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#333', textAlign: 'center' },
  subtext: { fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center' },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: { flex: 1, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, backgroundColor: '#fff' },
  addBtn: { backgroundColor: '#007AFF', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 24, lineHeight: 24 },
  taskList: { flex: 1 },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderColor: '#e0e0e0', borderWidth: 1 },
  taskItemCompleted: { opacity: 0.6, backgroundColor: '#e8f6e8' },
  taskText: { flex: 1, fontSize: 16, color: '#333', paddingHorizontal: 8 },
  taskTextCompleted: { textDecorationLine: 'line-through', color: '#555' },
  iconTouchable: { padding: 4 },
  icon: { fontSize: 22 },
  iconCompleted: { color: '#2e7d32' },
  deleteIcon: { fontSize: 20 },
});