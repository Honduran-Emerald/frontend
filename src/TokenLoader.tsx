import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './authentication/AuthNavigator';
import { LoadingScreen } from './common/LoadingScreen'
import { TokenManager } from './utils/TokenManager';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setToken, setUser } from './redux/authentication/authenticationSlice';
import i18n from 'i18n-js';
import { chatQueryRequest, getAllTrackersRequest, getUserSelfRequest, queryQuestsWithIds, queryTrackerNodesRequest, renewRequest } from './utils/requestHandler';
import { loadPinnedQuestPath, pinQuest, setAcceptedQuests, setRecentlyVisitedQuest, setTrackerWithUpdate } from './redux/quests/questsSlice';
import { QueriedQuest, QuestTracker } from './types/quest';
import { ExpoNotificationWrapper } from './ExpoNotificationWrapper';
import { loadChatPreview } from './redux/chat/chatSlice';
import { deleteItemLocally } from './utils/SecureStore';
import { LocalUpdatedTrackerIds, registerGeofencingTask } from './utils/TaskManager';
import { getData } from './utils/AsyncStore';
import {getLocationSubscription, registerBackgroundLocationTask} from "./utils/locationHandler";


i18n.fallbacks = true;
i18n.locale = 'en-GB';

export const TokenLoader = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [checkingToken, setCheckingToken] = React.useState<boolean>(true);
  const [tokenAccepted, setTokenAccepted] = useState<boolean>(false);

  const navigationRef = React.useRef(null);

  const { token } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

  const [a, sa] = useState('----');

  useEffect(() => {
    setIsLoading(true);
    TokenManager.getToken()
      .then(token => {
          if (token) {
            sa('has token' + token.substring(0,10))
            dispatch(setToken(token))
          } else {
            sa('has no token')
            setCheckingToken(false)
          }
        })
      .catch(() => {
          deleteItemLocally('UserToken')
          setCheckingToken(false)
        })
  }, [])

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    renewRequest().then(() => setCheckingToken(false))

  }, [token])

  useEffect(() => {
    if (checkingToken || !isLoading) return;

    if (!token) {
      setIsLoading(false);
      setTokenAccepted(false);
      return;
    }

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
            .then(() => getData('PinnedQuestTracker')
            .then((res) => {
              if(res) {
                const oldPinTracker = JSON.parse(res);
                acceptedQuests.some((tracker) => {
                  if(tracker.trackerId === oldPinTracker.trackerId) {
                    dispatch(pinQuest(tracker));
                    queryTrackerNodesRequest(tracker.trackerId)
                    .then(res => res.json())
                    .then(res => dispatch(loadPinnedQuestPath(res)));
                    return true;
                  }
                })
              } else {
                acceptedQuests.some((tracker) => {
                  if(!tracker.finished) {
                    dispatch(pinQuest(tracker));
                    queryTrackerNodesRequest(tracker.trackerId)
                    .then(res => res.json())
                    .then(res => dispatch(loadPinnedQuestPath(res)));
                    return true;
                  }
                });
              }
            }))
            .then(() => registerGeofencingTask(acceptedQuests))
            .then(() => getData(LocalUpdatedTrackerIds).then((res) => {
              if(res) {
                const updates = JSON.parse(res)
                const newUpdates = updates.filter((id: string) => acceptedQuests.find((tracker) => tracker.trackerId === id))
                dispatch(setTrackerWithUpdate(newUpdates))
              }
            }))
        }
      })
    )

    promises.push(
      getData('RecentlyVisitedQuests')
        .then((res) => {
          if(res) {
            const recentQuests = JSON.parse(res);
            const ids = recentQuests.map((quest: QueriedQuest) => quest.id)
            queryQuestsWithIds(ids[0], ids.slice(1)).then((res) => {
              if(res.status === 200) {
                res.json().then((data) => dispatch(setRecentlyVisitedQuest(data)))
              } else {
                console.log('error while loading recents ' + res.status);
              }
            })
          }
        })
    )

    promises.push(
      registerBackgroundLocationTask()
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
      .then(() => setTokenAccepted(true))
  }, [checkingToken, isLoading])

  return (

    (isLoading || checkingToken) ? (<LoadingScreen/>) : (
        <NavigationContainer ref={navigationRef}>
        {token && tokenAccepted ? (
            <ExpoNotificationWrapper navigationRef={navigationRef} />
        ) : (
            <AuthNavigator/>
        )}
    </NavigationContainer>)

  );
}
