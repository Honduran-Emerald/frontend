import React, { useEffect, useState } from 'react';
import {StatusBar as StatusBar2, StyleSheet, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTop } from './ProfileTop';
import { Colors } from '../styles';
import { ScrollMenu } from "../discovery/ScrollMenu";
import { StatusBar } from "expo-status-bar";
import { getLocation } from "../utils/locationHandler";
import { QuestHeader } from "../types/quest";
import {createQueryRequest, queryQuestsRequest} from "../utils/requestHandler";
import { useAppSelector } from '../redux/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/core";

export default interface profileProps {
    ownProfile: boolean
}

export const ProfileScreen = (props: profileProps) => {
  const insets = useSafeAreaInsets();

  const location = useAppSelector(state => state.location.location)
  const user = useAppSelector((state) => state.authentication.user);

  const [quests, setQuests] = useState<QuestHeader[]>([]);
  const [publishedQuests, setPublishedQuests] = useState<QuestHeader[]>([]);
  const [completedQuests, setCompletedQuests] = useState<QuestHeader[]>([]);
  const [draftQuests, setDraftQuests] = useState<QuestHeader[]>([]);
  const [upvotedQuests, setUpvotedQuests] = useState<QuestHeader[]>([]);

  const navigation = useNavigation();

  const lodash = require("lodash")

  useEffect(() => {
    queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests));
    createQueryRequest(50).then(res => res.json()).then((quests) => {
      let drafts : QuestHeader[] = [];
      let published : QuestHeader[] = [];
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
    // Get Location Permission and set initial Location
    getLocation().catch((err: Error) => {});
  },[])

  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView contentContainerStyle={style.profile}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{top: 5, right: 5, position: "absolute"}}>
            <MaterialCommunityIcons name="cog" size={30} color='#1D79AC' />
        </TouchableOpacity>
        {user && <ProfileTop ownProfile profileData={{username: user?.userName, followers: 200, level: user?.level, xp: user?.experience, profileImageId: user?.image, questsCreated: 100, questsPlayed: 300}} />}
          {location && (
            <>
              <ScrollMenu header={"Published Quests"} type={"published"} location={location} quests={publishedQuests}/>
              <ScrollMenu header={"Completed Quests"} type={"completed"} location={location} quests={quests}/>
              <ScrollMenu header={"Drafts"} type={"drafts"} location={location} quests={draftQuests}/>
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