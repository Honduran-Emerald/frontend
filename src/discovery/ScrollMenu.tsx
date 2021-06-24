import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, StatusBar, FlatList} from "react-native";
import {Colors} from "../styles";
import {QuestHeader} from "../types/quest";
import {queryQuestsRequest} from "../utils/requestHandler";
import {Button, Card, Paragraph, Surface, Title} from "react-native-paper";
import { useNavigation } from '@react-navigation/core';
import * as Location from "expo-location";
import {LocationObject} from "expo-location";
import {LatLng} from "react-native-maps";

export default interface scrollProps {
    header: string
    type: string
    location: LocationObject
    quests: QuestHeader[]
}

export interface questProps {
    quest: QuestHeader
    location: LocationObject
}

export function getDistanceFromLatLonInKm(lat1:number, lon1:number, lat2:number, lon2:number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    let unit = " km";
    if (d > 10) {
        d = Math.round(d);
    }
    else if (d > 1) {
        d = d * 10;
        d = Math.round(d);
        d = d / 10;
    }
    else {
        d = d * 1000;
        d = Math.round(d);
        unit = " m";
    }
    return d + unit;
}

function deg2rad(deg:number) {
    return deg * (Math.PI/180)
}

export const QuestPreview = (props:questProps) => {

    const [location, setLocation] = useState<Location.LocationObject>();
    const [distance, setDistance] = useState("");

    useEffect(() => {
        props.location && props.quest.location &&
        setDistance(getDistanceFromLatLonInKm(props.quest.location.latitude, props.quest.location.longitude, props.location.coords.latitude, props.location.coords.longitude));
    }, [props.location])

    const navigation = useNavigation();
    return(
        <Card style={styles.quest} onPress={() => navigation.navigate('QuestDetail', {quest: props.quest})}>
            <Card.Cover style={styles.pic} source={require('../../assets/background.jpg')} resizeMode='stretch' />
            <Card.Title style={styles.content} titleStyle={styles.title} titleNumberOfLines={2} title={props.quest.title} />
            <Card.Content style={styles.content}>

            </Card.Content>
            <Card.Actions style={styles.actions}>
                <View>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{distance}</Button>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{props.quest.votes}</Button>
                </View>
                <View>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{props.quest.approximateTime}</Button>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{props.quest.ownerName}</Button>
                </View>
            </Card.Actions>
        </Card>
    )
}

export const ScrollMenu = (props:scrollProps) => {

    return (
        <View style={styles.surface}>
            <Surface>
                <Text style={styles.header}>
                    {props.header}
                </Text>
                <ScrollView horizontal>
                    {props.quests && props.quests.map((q, index) => (
                            <QuestPreview key={index} quest={q} location={props.location} />
                        )
                    )}
                </ScrollView>
            </Surface>
        </View>

    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 5,
        marginLeft: 5,
    },
    surface: {
        margin: 0,
        padding: 10,
        paddingHorizontal: 0,
        height: 250,
        justifyContent: 'center',
    },
    quest: {
        margin: 1,
        marginHorizontal: 7,
        width: 150,
    },
    pic: {
        height: 80,
    },
    title: {
        fontSize: 12,
        lineHeight: 15,
    },
    content: {
        marginLeft: -10,
        marginTop: -5,
    },
    bContent: {
        width: 75,
        margin: -5,
    },
    bLabel: {
        fontSize: 10,
        color: Colors.primary,
    },
    actions: {
        marginTop: 4,
    },
});
