import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Surface } from "react-native-paper";
import {GameplayQuestHeader, QueriedQuest} from "../types/quest";
import { LocationObject } from "expo-location";
import { QuestPreviewLoader } from './QuestPreviewLoader';
import { AddDraftCard } from './AddDraftCard';
import { LevelLock } from '../common/LevelLock';
import { useAppSelector } from '../redux/hooks';

export default interface ScrollMenuProps {
    header: string
    type: string
    location: LocationObject | undefined
    quests: GameplayQuestHeader[] | QueriedQuest[] | undefined
    addQuest?: true
}

export const ScrollMenu: React.FC<ScrollMenuProps> = ({ header, quests, location, addQuest }) => {

    const [loadingArray, ] = useState(new Array(2+Math.floor(Math.random()*3)));
    const user = useAppSelector(state => state.authentication.user)

    return (
        <View style={styles.surface}>
            <Surface>
                <Text style={styles.header}>
                    {header}
                </Text>
                <FlatList
                    horizontal
                    data={quests || loadingArray}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={addQuest && location && (() => (
                        <LevelLock permission={user?.questCount + 'quests' //TODO This will not work in the future
                    }><AddDraftCard /></LevelLock>
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
});
