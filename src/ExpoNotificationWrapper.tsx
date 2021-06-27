import React, { useRef } from 'react';
import MainAppNavigator from './MainAppNavigator';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import Constants from 'expo-constants';
import { Platform, Text, View } from 'react-native';
import { useState } from 'react';
import { Subscription } from 'expo-sensors/build/Pedometer';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { ChatWrapperNavigator } from './ChatWrapperNavigator';
import { getImageAddress, invalidatemessagingtokenRequest, userUpdatemessagingtoken } from './utils/requestHandler';
import { getMessage } from './redux/chat/chatSlice';
import { ChatMessageNotif, ChatTextMessageNotif } from './types/general';
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export const ExpoNotificationWrapper: React.FC<{navigationRef: any}> = ({ navigationRef }) => {

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const tokenListener = useRef<Subscription>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) userUpdatemessagingtoken(token).then(
        () => console.log('Set token to', token)
      )
    })
    tokenListener.current = Notifications.addPushTokenListener((token) => {
      userUpdatemessagingtoken(token.data).then(
        () => console.log('Updated token to', token)
      )
    })

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification)
      dispatch(getMessage(notification.request.content.data as unknown as ChatMessageNotif))
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)

      dispatch(getMessage(response.notification.request.content.data as unknown as ChatMessageNotif))
      navigationRef?.current.navigate('ChatPersonal', {
        userName: response.notification.request.content.data.Username, //response.notification.request.content.data.Sender,
        //@ts-ignore
        userImgSource: getImageAddress(response.notification.request.content.data.UserImageId, response.notification.request.content.data.Username),//response.notification.request.content.data.ImageID,
        //@ts-ignore
        userTargetId: response.notification.request.content.data.Message.Sender, 
      })
    })

    return () => {
      if (tokenListener.current) {
        Notifications.removePushTokenSubscription(tokenListener.current)
      }
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      Notifications.getExpoPushTokenAsync().then(
        (token) => invalidatemessagingtokenRequest(token.data)
      )
    }
  }, [])

  return (
      <ChatWrapperNavigator />
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