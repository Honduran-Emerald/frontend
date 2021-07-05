import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar as StatusBar2 } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../styles";
import { ScrollMenu } from "./ScrollMenu";
import { GameplayQuestHeader } from "../types/quest";
import { queryQuestsRequest } from "../utils/requestHandler";
import { Searchbar } from "react-native-paper";
import { removeSpecialChars } from "../gameplay/QuestlogScreen";
import { WideQuestPreview } from "./WideQuestPreview";
import { useAppSelector } from "../redux/hooks";
import { getLocation } from "../utils/locationHandler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const DiscoveryScreen = () => {

    const insets = useSafeAreaInsets();

    const location = useAppSelector(state => state.location.location)
    const [quests, setQuests] = useState<GameplayQuestHeader[] | undefined>(undefined);
    const [search, setSearch] = React.useState('');

    useEffect(() => {
        queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests));
        // Get Location Permission and set initial Location
        getLocation().catch(() => {});
    },[])

    const getQuestSearch = () => {
        if (!quests) return [];
        if (search) {
            let newQuests: GameplayQuestHeader[] = [];
            const normalizedSearch = removeSpecialChars(search);
            quests.map((quest) => {
                const normalizedQuestName = removeSpecialChars(quest.title);
                const normalizedAuthor = removeSpecialChars(quest.ownerName);
                if (normalizedQuestName.includes(normalizedSearch) || normalizedAuthor.includes(normalizedSearch)) {
                    newQuests.push(quest);
                }
            })
            return newQuests;
        }
        return quests;
    }

    return (
        <View style={[styles.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
            <View style={styles.searchbar}>
                <Searchbar
                  placeholder={"Search for quest title or creator"}
                  onChangeText={(input) => setSearch(input)}
                  value={search}
                  theme={{colors: {primary: Colors.primary}}}
                />
            </View>
            <ScrollView contentContainerStyle={styles.discovery}>
                {search === '' && (
                    <>
                        <ScrollMenu header={"Nearby"} type={"nearby"} location={location} quests={quests}/>
                        <ScrollMenu header={"Check out!"} type={"checkout"} location={location} quests={quests}/>
                        <ScrollMenu header={"Recently Visited"} type={"recent"} location={location} quests={quests}/>
                    </>)
                }
                {quests && search !== '' && location && (
                  <View style={{alignItems: 'center'}}>
                      {getQuestSearch().map((q, index) => (
                          <WideQuestPreview key={index} quest={q} location={location}/>
                        )
                      )}
                  </View>)
                }
            </ScrollView>
            <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        backgroundColor: Colors.background,
        marginTop: StatusBar2.currentHeight,
    },
    searchbar: {
        justifyContent: 'center',
        padding: 15,
        backgroundColor: Colors.background,
    },
    discovery: {
        margin: 10,
        marginTop: 0,
        paddingBottom: 90,
    },
});
