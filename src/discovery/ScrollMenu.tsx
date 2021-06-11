import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, StatusBar} from "react-native";
import {Colors} from "../styles";
import {QuestHeader} from "../types/quest";
import {queryQuestsRequest} from "../utils/requestHandler";
import {Button, Card, Paragraph, Surface, Title} from "react-native-paper";
import { useNavigation } from '@react-navigation/core';

export default interface scrollProps {
    header: string
    type: string
}

export interface questProps {
    quest: QuestHeader
}

export const QuestPreview = (props:questProps) => {
    const navigation = useNavigation();
    return(
        <Card style={styles.quest} >
            <Card.Cover style={styles.pic} source={require('../../assets/background.jpg')} resizeMode='stretch' />
            <Card.Title style={styles.content} titleStyle={styles.title} titleNumberOfLines={2} title={"Finde Phisns Vogel (pls)"} />
            <Card.Content style={styles.content}>

            </Card.Content>
            <Card.Actions style={styles.actions}>
                <View>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>1km</Button>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>300 +</Button>
                </View>
                <View>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>3h</Button>
                    <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>Phisn</Button>
                </View>
            </Card.Actions>
        </Card>
    )
}

export const ScrollMenu = (props:scrollProps) => {

    const [quests, setQuests] = useState<QuestHeader[]>([]);

    useEffect(() => {
        queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests))
    },[])

    return (
        <View style={styles.surface}>
            <Surface>
                <Text style={styles.header}>
                    {props.header}
                </Text>
                <ScrollView horizontal>
                    {quests && quests.concat(quests).map((q, index) => (
                            <QuestPreview key={index} quest={q}/>
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
        paddingRight: 0,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center'
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