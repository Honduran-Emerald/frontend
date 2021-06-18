import React, {useEffect, useState} from 'react';
import {StatusBar as StatusBar2, StyleSheet, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles';
import {ScrollMenu} from "../discovery/ScrollMenu";
import * as Location from "expo-location";
import {LocationObject} from "expo-location";
import {StatusBar} from "expo-status-bar";

export default interface profileProps {
    //location: LocationObject
    ownProfile: boolean
}

export const ProfileScreen = (props: profileProps) => {
  const insets = useSafeAreaInsets();

    const [location, setLocation] = useState<Location.LocationObject>();

    // Get Location Permission and set initial Location
    useEffect(() => {
        getLocation().catch((err: Error) => {});
    }, [])

    async function getLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return Promise.reject(new Error("Permission to access location was denied"))
        }

        let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
        setLocation(location);
    }

  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView contentContainerStyle={style.profile}>
          {location && (
              <>
                  <ScrollMenu header={"Published Quests"} type={"published"} location={location}/>
                  <ScrollMenu header={"Completed Quests"} type={"completed"} location={location}/>
                  <ScrollMenu header={"Drafts"} type={"drafts"} location={location}/>
                  <ScrollMenu header={"Upvoted Quests"} type={"upvoted"} location={location}/>
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