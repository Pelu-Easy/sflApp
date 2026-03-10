import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

// This configures how the notification appears when the app is OPEN
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // Added these to fix the Type 'NotificationBehavior' error
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  // 1. Android Specific Channel Configuration
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10B981',
    });
  }

  // 2. Permission and Token Logic
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications in settings to receive transaction alerts.');
      return;
    }
    
    try {
      // Get the token for Expo Push Services
      token = (await Notifications.getExpoPushTokenAsync({
        // Replace with your actual project ID from app.json
        projectId: 'your-project-id-here', 
      })).data;
      
      console.log("DEVICE PUSH TOKEN:", token);
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  } else {
    console.log('Push Notifications only work on physical devices (not simulators)');
  }

  return token;
}