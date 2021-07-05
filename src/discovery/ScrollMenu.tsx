import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Colors } from "../styles";
import { Surface } from "react-native-paper";
import { GameplayQuestHeader } from "../types/quest";
import { LocationObject } from "expo-location";
import { QuestPreviewLoader } from './QuestPreviewLoader';

export default interface ScrollMenuProps {
    header: string
    type: string
    location: LocationObject | undefined
    quests: GameplayQuestHeader[] | undefined
}

export const ScrollMenu: React.FC<ScrollMenuProps> = ({ header, quests, location }) => {

    const [loadingArray, ] = useState(new Array(1+Math.floor(Math.random()*4)));

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
