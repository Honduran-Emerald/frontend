import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, StatusBar as StatusBar2} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Colors} from "../styles";
import {ScrollMenu} from "./ScrollMenu";
import * as Location from "expo-location";
import {useAppSelector} from "../redux/hooks";
import {getLocation} from "../utils/locationHandler";

export const DiscoveryScreen = () => {

    const location = useAppSelector(state => state.location.location)

    // Get Location Permission and set initial Location
    useEffect(() => {
        getLocation().catch((err: Error) => {});
    }, [])

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.discovery}>
                {location && (
                    <>
                    <ScrollMenu header={"Nearby"} type={"nearby"} location={location}/>
                    <ScrollMenu header={"Check out!"} type={"checkout"} location={location}/>
                    <ScrollMenu header={"Recently Visited"} type={"recent"} location={location}/>
                    </>)
                }
            </ScrollView>
            <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        justifyContent: "center",
        flexGrow: 1,
        backgroundColor: Colors.background,
        marginTop: StatusBar2.currentHeight,
    },
    discovery: {
        margin: 10,
        paddingBottom: 20,
    },
});