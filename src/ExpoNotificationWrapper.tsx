import React, { useRef } from 'react';
import MainAppNavigator from './MainAppNavigator';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import Constants from 'expo-constants';
import { Platform, Text, View } from 'react-native';
import { useState } from 'react';
import { Subscription } from 'expo-sensors/build/Pedometer';
import { useAppSelector } from './redux/hooks';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

export const ExpoNotificationWrapper: React.FC = () => {


  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    /* notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Hello there')
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('wolooolo',response)
    })

    return () => {
      console.log('STOP')
      if (notificationListener.current) {
        console.log('"Od')
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        console.log('DWAIUB')
        Notifications.removeNotificationSubscription(responseListener.current);

      }
    } */
  }, [])

  return (
      <MainAppNavigator />
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}