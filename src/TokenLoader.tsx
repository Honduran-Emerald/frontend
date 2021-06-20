import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './authentication/AuthNavigator';
import MainAppNavigator from './MainAppNavigator';
import { LoadingScreen } from './common/LoadingScreen'
import { TokenManager } from './utils/TokenManager';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setToken, setUser } from './redux/authentication/authenticationSlice';
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import { chatQueryRequest, getAllTrackersRequest, getUserSelfRequest, renewRequest } from './utils/requestHandler';
import { pinQuest, setAcceptedQuests } from './redux/quests/questsSlice';
import { loadItemLocally } from './utils/SecureStore';
import { QuestTracker } from './types/quest';
import { ExpoNotificationWrapper } from './ExpoNotificationWrapper';
import { loadChatPreview } from './redux/chat/chatSlice';
import { Text } from 'react-native'


i18n.fallbacks = true;
i18n.locale = Localization.locale;

export const TokenLoader = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [checkingToken, setCheckingToken] = React.useState<boolean>(true);
  const [hasRenewed, setHasRenewed] = React.useState<boolean>(false);

  const navigationRef = React.useRef(null);


  const { token } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

  useEffect(() => {
    TokenManager.getToken()
      .then(token => dispatch(setToken(token)))
      .then(() => renewRequest())
      .then(() => setHasRenewed(true))
      .then(() => setCheckingToken(false));
  }, [])

  useEffect(() => {
    if (token && !hasRenewed) return;
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const promises: Promise<any>[] = []

    let acceptedQuests: QuestTracker[] = [];
    promises.push(
      getAllTrackersRequest()
      .then((res) => {
        if (res.ok) {
          res.json()
            .then((data) => {
              dispatch(setAcceptedQuests(data.trackers));
              acceptedQuests = data.trackers;
            })
            .then(() => loadItemLocally('PinnedQuestTracker')
            .then((res) => {
              if(res) {
                const oldPinTracker = JSON.parse(res);
                acceptedQuests.some((tracker) => {
                  if(tracker.trackerId === oldPinTracker.trackerId) {
                    dispatch(pinQuest(tracker));
                  }
                })
              } else {
                acceptedQuests.some((tracker) => {
                  if(!tracker.finished) {
                    dispatch(pinQuest(tracker));
                    return true;
                  }
                });
              }
            }))
        }
      })
    )
    
    promises.push(
      getUserSelfRequest()
        .then((res) => {
          if (res.status === 200) {
            res.json().then(data => {
              dispatch(setUser(data.user))
            })
          }
        })
    )


    promises.push(
      chatQueryRequest()
        .then(res => res.json())
        .then(res => dispatch(loadChatPreview(res.chats)))
    )
    

    Promise.all(promises)
      .then(() => setIsLoading(false))
  }, [token, hasRenewed, checkingToken])

  return (

    (isLoading || checkingToken) ? (<><Text>{JSON.stringify(isLoading)}{JSON.stringify(checkingToken)}</Text><LoadingScreen/></>) : (
        <NavigationContainer ref={navigationRef}>
        {token ? (
            <ExpoNotificationWrapper navigationRef={navigationRef} />
        ) : (
            <AuthNavigator/>
        )}
    </NavigationContainer>)

  );
}
