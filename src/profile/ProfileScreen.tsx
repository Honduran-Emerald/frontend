import React, { useState } from 'react';
import { RefreshControl, ScrollView, StatusBar as StatusBar2, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTop } from './ProfileTop';
import { Colors } from '../styles';
import { ScrollMenu } from "../discovery/ScrollMenu";
import { StatusBar } from "expo-status-bar";
import {
  createQueryRequest,
  getUserRequest,
  queryfinishedQuestsRequest,
  queryQuestsRequest,
  queryvotedQuestsRequest
} from "../utils/requestHandler";
import { GameplayQuestHeader } from "../types/quest";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { User } from '../types/general';
import { useCallback } from 'react';
import { setUser } from '../redux/authentication/authenticationSlice';

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const lodash = require("lodash")
  const navigation = useNavigation();

  const authenticatedUser = useAppSelector(state => state.authentication.user);
  const location = useAppSelector(state => state.location.location)
  const route = useRoute<RouteProp<{Profile: {userId: string}}, 'Profile'>>();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [foreignUser, setForeignUser] = useState<User | undefined>();
  const [publishedQuests, setPublishedQuests] = useState<GameplayQuestHeader[]>([]);
  const [completedQuests, setCompletedQuests] = useState<GameplayQuestHeader[]>([]);
  const [draftQuests, setDraftQuests] = useState<GameplayQuestHeader[]>([]);
  const [upvotedQuests, setUpvotedQuests] = useState<GameplayQuestHeader[]>([]);

  const currentUserId = route.params?.userId || authenticatedUser!.userId
  const isOwnProfile = route.params?.userId == null || route.params.userId === authenticatedUser!.userId
  const currentUser = isOwnProfile ? authenticatedUser : foreignUser;
  const setCurrentUser = isOwnProfile ? ((user : User) => dispatch(setUser(user))) : setForeignUser;


  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      fetchQuestData();
    }, [])
  )

  const fetchUserData = () => {
    getUserRequest(currentUserId).then(response => response.json()).then(obj => setCurrentUser(obj.user));
  }

  const fetchQuestData = async () => {
    return Promise.all([
      // set published
      queryQuestsRequest(0, currentUserId)
      .then(response => response.json())
      .then(obj => setPublishedQuests(obj.quests)),
      // set drafts
      createQueryRequest(0).then(res => res.json()).then((quests) => {
        if (isOwnProfile) {
          let drafts: GameplayQuestHeader[] = [];
          quests.prototypes.forEach(
            (prototype: any) => {
              if (prototype.quest !== null && prototype !== null && prototype.title !== null && prototype.outdated) {
                let pr = lodash.cloneDeep(prototype);
                drafts.push(Object.assign(pr.quest, pr));
              }
            }
          );
          setDraftQuests(drafts);
        }
      }),
      // set completed
      queryfinishedQuestsRequest(currentUserId, 0).then(res => res.json()).then((quests) => {setCompletedQuests(quests.quests)}),
      // set upvoted
      queryvotedQuestsRequest("Up", currentUserId).then(res => res.json()).then((quests) => setUpvotedQuests(quests.quests)),

    ].map(promise => promise.catch(() => {})))
  }

  const onRefresh = () => {
    setRefreshing(true)

    // fetch user data
    fetchUserData();

    // fetch quest data
    fetchQuestData().then(() => setRefreshing(false))
  }

  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView
        contentContainerStyle={style.profile}
        refreshControl={
          <RefreshControl refreshing={refreshing} enabled onRefresh={onRefresh}/>
        }
      >
        {isOwnProfile &&
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{top: 5, right: 5, position: "absolute"}}>
            <MaterialCommunityIcons name="cog" size={30} color='#1D79AC' />
          </TouchableOpacity>
        }
        {currentUser && 
          <ProfileTop 
            ownProfile={isOwnProfile} 
            profileData={currentUser}
            refresh={fetchUserData}
          />
        }
        {(
          <>
            <ScrollMenu header={"Published Quests"} type={"published"} location={location} quests={publishedQuests}/>
            <ScrollMenu header={"Completed Quests"} type={"completed"} location={location} quests={completedQuests}/>
            {isOwnProfile &&
            <ScrollMenu header={"Drafts"} type={"drafts"} location={location} quests={draftQuests} addQuest/>}
            <ScrollMenu header={"Upvoted Quests"} type={"upvoted"} location={location} quests={upvotedQuests}/>
          </>)
        }
      </ScrollView>
      <StatusBar style="auto"/>
    </View>
  );
}

const style = StyleSheet.create({
    screen: {
        flexGrow: 1,
        backgroundColor: Colors.background,
        marginTop: StatusBar2.currentHeight,
    },
    profile: {
        flex: 1,
        margin: 10,
        paddingBottom: 20,
    },
})
