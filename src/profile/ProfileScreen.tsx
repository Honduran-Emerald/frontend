import React, {useEffect, useState} from 'react';
import {StatusBar as StatusBar2, StyleSheet, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTop } from './ProfileTop';
import { Colors } from '../styles';
import {ScrollMenu} from "../discovery/ScrollMenu";
import * as Location from "expo-location";
import {LocationObject} from "expo-location";
import {StatusBar} from "expo-status-bar";
import {getLocation} from "../utils/locationHandler";
import {useAppSelector} from "../redux/hooks";
import {QuestHeader} from "../types/quest";
import {queryQuestsRequest} from "../utils/requestHandler";

export default interface profileProps {
    ownProfile: boolean
}

export const ProfileScreen = (props: profileProps) => {
  const insets = useSafeAreaInsets();

    const location = useAppSelector(state => state.location.location)
    const [quests, setQuests] = useState<QuestHeader[]>([]);

    useEffect(() => {
        queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests));
        // Get Location Permission and set initial Location
        getLocation().catch((err: Error) => {});
    },[])

  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView contentContainerStyle={style.profile}>
        <ProfileTop />
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