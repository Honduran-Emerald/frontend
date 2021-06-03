import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './authentication/AuthNavigator';
import MainAppNavigator from './MainAppNavigator';
import { LoadingScreen } from './common/LoadingScreen'
import { TokenManager } from './utils/TokenManager';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setToken } from './redux/authentication/authenticationSlice';
import i18n from 'i18n-js';
import * as Localization from "expo-localization";
import {getAllTrackersRequest} from "./utils/requestHandler";
import {pinQuest, setAcceptedQuests} from "./redux/quests/questsSlice";
import {loadItemLocally} from "./utils/SecureStore";
import {QuestTracker} from "./types/quest";

i18n.fallbacks = true;
i18n.locale = Localization.locale;

export const TokenLoader = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const token = useAppSelector((state) => state.authentication.token)
  const dispatch = useAppDispatch()

  useEffect(() => {
    TokenManager.getToken()
      .then(token => dispatch(setToken(token)))
      .then(() => setIsLoading(false));
  }, [])

  useEffect(() => {
    let acceptedQuests: QuestTracker[] = [];
    if(token) {
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
                  dispatch(pinQuest(JSON.parse(res)));
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
        });
    }
  }, [token])

  return (

    (isLoading) ? (<LoadingScreen/>) : (
        <NavigationContainer>
        {token ? (
            <MainAppNavigator/>
        ) : (
            <AuthNavigator/>
        )}
    </NavigationContainer>)

  );
}
