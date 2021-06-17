import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, StatusBar as StatusBar2} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Colors} from "../styles";
import {ScrollMenu} from "./ScrollMenu";
import * as Location from "expo-location";
import {QuestHeader} from "../types/quest";
import {queryQuestsRequest} from "../utils/requestHandler";
import {Searchbar} from "react-native-paper";
import {removeSpecialChars} from "../common/QuestlogScreen";
import {WideQuestPreview} from "./WideQuestPreview";

export const DiscoveryScreen = () => {

    const [location, setLocation] = useState<Location.LocationObject>();
    const [quests, setQuests] = useState<QuestHeader[]>([]);
    const [search, setSearch] = React.useState('');

    useEffect(() => {
        queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests))
    },[])

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

    const getQuestSearch = () => {
        if(search) {
            let newQuests: QuestHeader[] = [];
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
        <View style={styles.screen}>
            <View style={styles.searchbar}>
                <Searchbar
                  placeholder={"Search for quest title or creator"}
                  onChangeText={(input) => setSearch(input)}
                  value={search}
                  theme={{colors: {primary: Colors.primary}}}
                />
            </View>
            <ScrollView contentContainerStyle={styles.discovery}>
                {location && search === '' && (
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
        justifyContent: "center",
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
        paddingBottom: 50,
    },
});
