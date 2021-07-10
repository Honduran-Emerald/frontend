import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Surface } from "react-native-paper";
import {GameplayQuestHeader, QueriedQuest} from "../types/quest";
import { LocationObject } from "expo-location";
import { QuestPreviewLoader } from './QuestPreviewLoader';
import { AddDraftCard } from './AddDraftCard';
import {Colors} from "../styles";
import {StoryModule} from "../gameplay/modules/StoryModule";
import { LevelLock } from '../common/LevelLock';
import { useAppSelector } from '../redux/hooks';

export default interface ScrollMenuProps {
    header: string
    type: string
    location: LocationObject | undefined
    quests: GameplayQuestHeader[] | QueriedQuest[] | undefined
    addQuest?: true
}

export const ScrollMenu: React.FC<ScrollMenuProps> = ({ header, quests, location, addQuest, type}) => {

    const [loadingArray, ] = useState(new Array(2+Math.floor(Math.random()*3)));
    const user = useAppSelector(state => state.authentication.user)

    return (
        <View style={styles.surface}>
            <Surface>
                <Text style={styles.header}>
                    {header}
                </Text>
                {(quests && quests.length == 0) &&
                (() => {
                    switch (type) {
                        case 'published':
                            return <View style={styles.placeholder}><Text> No published quests found </Text></View>
                        case 'drafts':
                            return <View style={styles.placeholder}><Text> No drafts here yet </Text></View>
                        case 'completed':
                            return <View style={styles.placeholder}><Text> No completed quests found </Text></View>
                        case 'upvoted':
                            return <View style={styles.placeholder}><Text> No upvoted quests found </Text></View>
                        case 'nearby':
                            return <View style={styles.placeholder}><Text> No quests found nearby </Text></View>
                        case 'checkout':
                            return <View style={styles.placeholder}><Text> No quests to check out found </Text></View>
                        case 'recent':
                            return <View style={styles.placeholder}><Text> You have not visited any quests recently </Text></View>
                        case 'following':
                            return <View style={styles.placeholder}><Text> There are no quests made by the users you follow yet </Text></View>

                    }
                })()
                }
                <FlatList
                    horizontal
                    data={quests || loadingArray}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={addQuest && location && (() => (
                        <LevelLock permission={{
                                type: 'quests',
                                quests: user?.questCount //TODO This will not work in the future
                            }}
                            dialog={{
                                title: 'Cannot create new quest',
                                message: 'Your level is too low. Increase your level to create more quests or delete a quest to make room for this one.'
                            }}
                            ><AddDraftCard /></LevelLock>
                    ))}
                    renderItem={
                        ({ item }: {item: GameplayQuestHeader | undefined}) => <QuestPreviewLoader loading={item === undefined} content={(item === undefined) ? null : {location: location, quest: item}}/>
                    }
                    keyExtractor={(item, idx) => (
                        item ? item.id : idx.toString()
                    )}
                />
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
        height: 240,
    },
    placeholder: {
        height: 190,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});
