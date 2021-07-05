import React, { useEffect, useState } from 'react';
import { StatusBar as StatusBar2, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTop } from './ProfileTop';
import { Colors } from '../styles';
import { ScrollMenu } from "../discovery/ScrollMenu";
import { StatusBar } from "expo-status-bar";
import { getLocation } from "../utils/locationHandler";
import { createQueryRequest, getUserFollowers, getUserRequest, queryQuestsRequest, queryvotedQuestsRequest } from "../utils/requestHandler";
import { GameplayQuestHeader } from "../types/quest";
import { useAppSelector } from '../redux/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from '@react-navigation/native';
import { User } from '../types/general';

export default interface profileProps {
    ownProfile: boolean
}

export const ProfileScreen = (props: profileProps) => {
  const insets = useSafeAreaInsets();

  const location = useAppSelector(state => state.location.location)
  const authenticatedUser = useAppSelector((state) => state.authentication.user);

  const [user, setUser] = useState<User>();
  const [quests, setQuests] = useState<GameplayQuestHeader[]>([]);
  const [publishedQuests, setPublishedQuests] = useState<GameplayQuestHeader[]>([]);
  const [completedQuests, setCompletedQuests] = useState<GameplayQuestHeader[]>([]);
  const [draftQuests, setDraftQuests] = useState<GameplayQuestHeader[]>([]);
  const [upvotedQuests, setUpvotedQuests] = useState<GameplayQuestHeader[]>([]);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<{Profile: {userId: string}}, 'Profile'>>();

  const lodash = require("lodash")

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

  useEffect(() => {
    if(route.params?.userId && route.params.userId !== authenticatedUser?.userId) {
      getUserRequest(route.params.userId).then(response => response.json()).then(obj => setUser(obj.user));
    } else {
      setUser(authenticatedUser);
    }
    
    queryQuestsRequest(0, route.params?.userId || authenticatedUser?.userId)
      .then(response => response.json())
      .then(obj => setPublishedQuests(obj.quests));
  }, [])

  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView contentContainerStyle={style.profile}>
        {(authenticatedUser?.userId === user?.userId) &&
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{top: 5, right: 5, position: "absolute"}}>
            <MaterialCommunityIcons name="cog" size={30} color='#1D79AC' />
          </TouchableOpacity>
        }
        {user && authenticatedUser && 
          <ProfileTop 
            ownProfile={authenticatedUser.userId === user.userId} 
            profileData={{userId: user.userId, username: user.userName, followers: user.followerCount, level: user.level, xp: user.experience, profileImageId: user.image, questsCreated: user.questCount, questsPlayed: user.trackerCount}} 
            following={user.following}
            friends={user.follower && user.following}
          />
        }
          {location && (
            <>
              <ScrollMenu header={"Published Quests"} type={"published"} location={location} quests={publishedQuests}/>
              <ScrollMenu header={"Completed Quests"} type={"completed"} location={location} quests={quests}/>
              <ScrollMenu header={"Drafts"} type={"drafts"} location={location} quests={draftQuests}/>
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
        margin: 10,
        paddingBottom: 20,
    },
})