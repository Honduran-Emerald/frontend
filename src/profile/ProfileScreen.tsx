import React, {useEffect, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles';
import {ScrollMenu} from "../discovery/ScrollMenu";
import * as Location from "expo-location";
import {LocationObject} from "expo-location";

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
      <ScrollView style={style.profile}>
          {location && (
              <>
                  <ScrollMenu header={"Published Quests"} type={"published"} location={location}/>
                  <ScrollMenu header={"Completed Quests"} type={"completed"} location={location}/>
                  <ScrollMenu header={"Drafts"} type={"drafts"} location={location}/>
                  <ScrollMenu header={"Upvoted Quests"} type={"upvoted"} location={location}/>
              </>)
          }
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    profile: {
        margin: 10,
        paddingBottom: 20,
    },
})