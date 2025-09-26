import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions
export const registerForPushNotifications = async () => {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  
  token = (await Notifications.getExpoPushTokenAsync({ projectId: '5cd890f7-c1dc-4d2c-91ed-03d1c4932643' })).data;
  
  return token;
};

// Schedule notification for task due date
export const scheduleTaskNotification = async (taskId, title, body, dueDate) => {
  // Calculate trigger time (convert dueDate to trigger)
  const trigger = new Date(dueDate);
  // Set notification to appear 30 minutes before due date
  trigger.setMinutes(trigger.getMinutes() - 30);
  
  // Check if date is in the future
  if (trigger < new Date()) {
    console.log('Cannot schedule notification for past date');
    return null;
  }

  // Create identifier
  const identifier = `task-${taskId}`;
  
  // Schedule notification
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Task Due Soon: ${title}`,
      body: body || 'Your task is due in 30 minutes',
      data: { taskId },
      sound: true,
      badge: 1,
    },
    trigger,
    identifier,
  });

  return id;
};

// Cancel notification for task
export const cancelTaskNotification = async (taskId) => {
  const identifier = `task-${taskId}`;
  await Notifications.cancelScheduledNotificationAsync(identifier);
};

// Get all scheduled notifications
export const getAllScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};