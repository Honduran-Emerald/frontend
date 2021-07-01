import React, { useEffect, useState } from 'react';
import { StatusBar as StatusBar2, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTop } from './ProfileTop';
import { Colors } from '../styles';
import { ScrollMenu } from "../discovery/ScrollMenu";
import { StatusBar } from "expo-status-bar";
import { getLocation } from "../utils/locationHandler";
import { GameplayQuestHeader, QuestHeader } from "../types/quest";
import { queryQuestsRequest } from "../utils/requestHandler";
import { useAppSelector } from '../redux/hooks';

export default interface profileProps {
    ownProfile: boolean
}

export const ProfileScreen = (props: profileProps) => {
  const insets = useSafeAreaInsets();

  const location = useAppSelector(state => state.location.location)
  const user = useAppSelector((state) => state.authentication.user);
  const [quests, setQuests] = useState<GameplayQuestHeader[]>([]);

  useEffect(() => {
      queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests));
      // Get Location Permission and set initial Location
      getLocation().catch((err: Error) => {});
  },[])

  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView contentContainerStyle={style.profile}>
        {user && <ProfileTop ownProfile profileData={{username: user?.userName, followers: 200, level: user?.level, xp: user?.experience, profileImageId: user?.image, questsCreated: 100, questsPlayed: 300}} />}
          {location && (
            <>
              <ScrollMenu header={"Published Quests"} type={"published"} location={location} quests={quests}/>
              <ScrollMenu header={"Completed Quests"} type={"completed"} location={location} quests={quests}/>
              <ScrollMenu header={"Drafts"} type={"drafts"} location={location} quests={quests}/>
              <ScrollMenu header={"Upvoted Quests"} type={"upvoted"} location={location} quests={quests}/>
            </>)
            }
      </ScrollView>
      <StatusBar style="auto"/>
    </View>
  );
}

const style = StyleSheet.create({
    screen: {
        justifyContent: "center",
        flexGrow: 1,
        backgroundColor: Colors.background,
        marginTop: StatusBar2.currentHeight,
    },
    profile: {
        margin: 10,
        paddingBottom: 20,
    },
})