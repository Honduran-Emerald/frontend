import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar as StatusBar2, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTop } from './ProfileTop';
import { Colors } from '../styles';
import { ScrollMenu } from "../discovery/ScrollMenu";
import { StatusBar } from "expo-status-bar";
import { getLocation } from "../utils/locationHandler";
import {
  createQueryRequest,
  getUserFollowers,
  getUserRequest,
  queryfinishedQuestsRequest,
  queryQuestsRequest,
  queryvotedQuestsRequest
} from "../utils/requestHandler";
import { GameplayQuestHeader } from "../types/quest";
import { useAppSelector } from '../redux/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { User } from '../types/general';
import { useCallback } from 'react';

export default interface profileProps {
    ownProfile: boolean
}

export const ProfileScreen = (props: profileProps) => {
  const insets = useSafeAreaInsets();

  const location = useAppSelector(state => state.location.location)
  const authenticatedUser = useAppSelector((state) => state.authentication.user);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [quests, setQuests] = useState<GameplayQuestHeader[]>([]);
  const [publishedQuests, setPublishedQuests] = useState<GameplayQuestHeader[]>([]);
  const [completedQuests, setCompletedQuests] = useState<GameplayQuestHeader[]>([]);
  const [draftQuests, setDraftQuests] = useState<GameplayQuestHeader[]>([]);
  const [upvotedQuests, setUpvotedQuests] = useState<GameplayQuestHeader[]>([]);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<{Profile: {userId: string}}, 'Profile'>>();

  const lodash = require("lodash")

  const fetchUserData = () => {
    if(route.params?.userId && route.params.userId !== authenticatedUser?.userId) {
      getUserRequest(route.params.userId).then(response => response.json()).then(obj => setUser(obj.user));
    } else {
      setUser(authenticatedUser);
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchQuestData();
  }, [])

  useFocusEffect(
    useCallback(() => {
      if(!user)
        fetchUserData();
      else
        getUserRequest(user.userId).then(response => response.json()).then(obj => setUser(obj.user));

      fetchQuestData()
    }, [])
  )

  const fetchQuestData = async () => {
    return Promise.all([
      // set published
      queryQuestsRequest(0, route.params?.userId || authenticatedUser?.userId)
      .then(response => response.json())
      .then(obj => setPublishedQuests(obj.quests)),
      // set drafts
      createQueryRequest(0).then(res => res.json()).then((quests) => {
        if (authenticatedUser?.userId) {
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
      queryfinishedQuestsRequest(route.params?.userId || authenticatedUser?.userId, 0).then(res => res.json()).then((quests) => {setCompletedQuests(quests.quests)}),
      // set upvoted
      queryvotedQuestsRequest("Up", route.params?.userId || authenticatedUser?.userId).then(res => res.json()).then((quests) => setUpvotedQuests(quests.quests)),

    ].map(promise => promise.catch(() => {})))
  }
  
  const onRefresh = () => {
    setRefreshing(true)
    // fetch user data
    if(!user)
      fetchUserData();
    else
      getUserRequest(user.userId).then(response => response.json()).then(obj => setUser(obj.user))

    // fetch quest data
    fetchQuestData().then(() => setRefreshing(false))
  }

  /*useEffect(() => {
    getUserFollowers().then(res => res.json()).then((followers) => setFollowerCount(followers.users.length));
    queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests));
    createQueryRequest(0).then(res => res.json()).then((quests) => {
      let drafts : GameplayQuestHeader[] = [];
      let published : GameplayQuestHeader[] = [];
      quests.prototypes.forEach(
        (prototype : any) => {
          if (prototype.released) {
              console.log(JSON.stringify(prototype.quest.title))
            published.push(prototype.quest);
          }
          if (prototype.quest !== null && prototype !== null && prototype.title !== null && prototype.outdated) {
            let pr = lodash.cloneDeep(prototype);
            drafts.push(Object.assign(pr.quest, pr));
          }
        }
      );
      setPublishedQuests(published);
      setDraftQuests(drafts);
    });
    queryvotedQuestsRequest("Up").then(res => res.json()).then((quests) => setUpvotedQuests(quests.quests));
    // Get Location Permission and set initial Location
    getLocation().catch((err: Error) => {});
  },[])*/

  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView 
        contentContainerStyle={style.profile}
        refreshControl={
          <RefreshControl refreshing={refreshing} enabled onRefresh={onRefresh}/>
        }
      >
        {(authenticatedUser?.userId === user?.userId) &&
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{top: 5, right: 5, position: "absolute"}}>
            <MaterialCommunityIcons name="cog" size={30} color='#1D79AC' />
          </TouchableOpacity>
        }
        {user && authenticatedUser && 
          <ProfileTop 
            ownProfile={authenticatedUser.userId === user.userId} 
            profileData={user}
            refresh={onRefresh}
          />
        }
        {(
          <>
            <ScrollMenu header={"Published Quests"} type={"published"} location={location} quests={publishedQuests}/>
            <ScrollMenu header={"Completed Quests"} type={"completed"} location={location} quests={completedQuests}/>
            {(authenticatedUser?.userId === user?.userId) &&
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