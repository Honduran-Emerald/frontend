import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ScrollView, StatusBar as StatusBar2, RefreshControl, FlatList} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../styles";
import { ScrollMenu } from "./ScrollMenu";
import { GameplayQuestHeader, QueriedQuest } from "../types/quest";
import {
  nearbyQuestsRequest,
  queryfollowingQuestsRequest,
  querynewQuestsRequest,
  queryQuestsWithIds,
  queryQuestsRequest
} from "../utils/requestHandler";
import { Searchbar } from "react-native-paper";
import { removeSpecialChars } from "../gameplay/QuestlogScreen";
import { WideQuestPreview } from "./WideQuestPreview";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getLocation } from "../utils/locationHandler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import { useCallback } from 'react';
import {setLocalQuests, setRecentlyVisitedQuest } from "../redux/quests/questsSlice";
import {QuestPreview} from "./QuestPreview";

export const DiscoveryScreen = () => {

  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const location = useAppSelector(state => state.location.location);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [quests, setQuests] = useState<GameplayQuestHeader[] | undefined>(undefined);
  const [nearbyQuests, setNearbyQuests] = useState<GameplayQuestHeader[] | undefined>(undefined);
  const [newQuests, setNewQuests] = useState<GameplayQuestHeader[] | undefined>(undefined);
  const [followingQuests, setFollowingQuests] = useState<GameplayQuestHeader[] | undefined>(undefined);
  const [search, setSearch] = React.useState('');
  const recentlyVisitedQuests = useAppSelector(state => state.quests.recentlyVisitedQuests);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  },[isFocused])

  const fetchData = async () => {
    const ids = recentlyVisitedQuests.length > 0 ? recentlyVisitedQuests.map((quest: QueriedQuest) => quest.id) : undefined

    return Promise.all([
      // Get Location Permission and set initial Location
      getLocation().then(async (location) => {
        await Promise.all([
          // get nearby quests in range 20km for discovery
          nearbyQuestsRequest(0, location?.coords.longitude, location?.coords.latitude, 20000)
            .then(res => res.json())
            .then((quests) => setNearbyQuests(quests.quests)),
          // get nearby quests in range 500km for map
          nearbyQuestsRequest(0, location?.coords.longitude, location?.coords.latitude, 500000)
            .then(res => res.json())
            .then((quests) => dispatch(setLocalQuests(quests.quests))),
          // get new quests in range 50km
          querynewQuestsRequest(0, location?.coords.longitude, location?.coords.latitude, 50000).then(res => res.json()).then((quests) => setNewQuests(quests.quests)),
        ])
      }).catch(() => {}),
      // set quest arrays
      queryQuestsRequest().then(res => res.json()).then((quests) => setQuests(quests.quests)),
      // get following
      queryfollowingQuestsRequest(0).then(res => res.json()).then((quests) => setFollowingQuests(quests.quests)),
      // refresh recents
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
      {
        search === '' &&
          <ScrollView contentContainerStyle={styles.discovery} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
            <>
              <ScrollMenu header={"Nearby"} type={"nearby"} location={location} quests={nearbyQuests}/>
              <ScrollMenu header={"New"} type={"checkout"} location={location} quests={newQuests}/>
              <ScrollMenu header={"Recently Visited"} type={"recent"} location={location} quests={[...recentlyVisitedQuests].reverse()}/>
              <ScrollMenu header={"Following"} type={"following"} location={location} quests={followingQuests}/>
            </>
          </ScrollView>
      }
      {
        search !== '' &&
        <View style={{alignItems: 'center'}}>
          <FlatList
            data={getQuestSearch()}
            renderItem={({item, index}) =>
              <View style={{marginBottom: 10}}>
                <QuestPreview key={index} quest={item} location={location}/>
              </View>
            }
            keyExtractor={(quest) => quest.id}
            numColumns={2}
            contentContainerStyle={{
              justifyContent: 'center'
            }}
          />
        </View>
      }
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
