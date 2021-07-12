import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar as StatusBar2, RefreshControl } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../styles";
import { ScrollMenu } from "./ScrollMenu";
import { GameplayQuestHeader, QueriedQuest } from "../types/quest";
import { nearbyQuestsRequest, queryQuestsRequest, queryQuestsWithIds } from "../utils/requestHandler";
import { Searchbar } from "react-native-paper";
import { removeSpecialChars } from "../gameplay/QuestlogScreen";
import { WideQuestPreview } from "./WideQuestPreview";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getLocation } from "../utils/locationHandler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { setRecentlyVisitedQuest } from "../redux/quests/questsSlice";

export const DiscoveryScreen = () => {

  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const location = useAppSelector(state => state.location.location);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [quests, setQuests] = useState<GameplayQuestHeader[] | undefined>(undefined);
  const [nearbyQuests, setNearbyQuests] = useState<GameplayQuestHeader[] | undefined>(undefined);
  const [search, setSearch] = React.useState('');
  const recentlyVisitedQuests = useAppSelector(state => state.quests.recentlyVisitedQuests);

  useEffect(() => {
    fetchData();
  },[])

  const fetchData = async () => {
    const ids = recentlyVisitedQuests.length > 0 ? recentlyVisitedQuests.map((quest: QueriedQuest) => quest.id) : undefined

    return Promise.all([
      // Get Location Permission and set initial Location
      getLocation().catch(() => {}),
      // set quest arrays
      queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests)),
      // nearbyQuestsRequest(0, location?.coords.longitude, location?.coords.latitude, 10).then(res => res.json()).then((quests) => setNearbyQuests(quests.quests)),
      ids ? queryQuestsWithIds(ids[0], ids.slice(1)).then((res) => {
        if(res.status === 200) {
          res.json().then((data) => dispatch(setRecentlyVisitedQuest(data)))
        } else {
          console.log('error while loading recents ' + res.status);
        }
      }) : undefined,
    ])
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false))
  }

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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  )

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
      <ScrollView contentContainerStyle={styles.discovery} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
        {search === '' && (
          <>
            <ScrollMenu header={"Nearby"} type={"nearby"} location={location} quests={quests}/>
            <ScrollMenu header={"Check out!"} type={"checkout"} location={location} quests={quests}/>
            <ScrollMenu header={"Recently Visited"} type={"recent"} location={location} quests={[...recentlyVisitedQuests].reverse()}/>
            <ScrollMenu header={"Following"} type={"following"} location={location} quests={quests}/>
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
