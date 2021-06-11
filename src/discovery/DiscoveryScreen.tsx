import React from 'react';
import {View, Text, StyleSheet, ScrollView, StatusBar as StatusBar2} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Colors} from "../styles";
import {ScrollMenu} from "./ScrollMenu";

export const DiscoveryScreen = () => {
    return (
        <View style={styles.screen}>
            <View style={styles.discovery}>
                <ScrollMenu header={"Nearby"} type={"nearby"}/>
                <ScrollMenu header={"Check out!"} type={"checkout"}/>
                <ScrollMenu header={"Recently Visited"} type={"recent"}/>
            </View>
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
    },
});