import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Colors} from "../styles";
import {QuestMeta} from "../types/quest";
import {queryQuestsRequest} from "../utils/requestHandler";
import {Button, Card, Paragraph, Surface, Title} from "react-native-paper";

export default interface scrollProps {
    header: string
    type: string
}

export interface questProps {
    quest: QuestMeta
}

export const QuestPreview = (props:questProps) => {
    return(
        <Card style={styles.quest}>
            <Card.Cover style={styles.pic} source={{ uri: 'https://cdn.discordapp.com/attachments/832279716698259477/846820630150119434/1280px-Honduran_Emerald_Amazilia_luciae_2495402213.jpg' }} />
            <Card.Title style={styles.content} titleStyle={styles.title} titleNumberOfLines={2} title={"Finde Phisns Vogel (pls)"} subtitle={props.quest.createdAt} />
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

    const [quests, setQuests] = useState<QuestMeta[]>([]);

    useEffect(() => {
        queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests))
    },[])

    return (
        <View>
            <Surface style={styles.surface}>
                <Text style={styles.header}>
                    {props.header}
                </Text>
                <ScrollView horizontal>
                    {quests && quests.map(q => (
                            <QuestPreview quest={q}/>
                        )
                    )}
                    <Text>
                        fshfjsdkhfaad s dasd assd
                    </Text>
                </ScrollView>
            </Surface>
        </View>

    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    surface: {
        margin: 5,
        padding: 10,
        height: 200,
        justifyContent: 'center',
        elevation: 4,
    },
    quest: {
        margin: 1,
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
        fontSize: 8,
    },
    actions: {
        marginTop: -12,
    },
});