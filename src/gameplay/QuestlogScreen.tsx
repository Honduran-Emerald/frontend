import React from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import {List, Searchbar} from 'react-native-paper';

import { Colors } from '../styles';
import { commonTranslations } from '../common/translations';
import { getAllTrackersRequest, queryTrackerNodesRequest } from '../utils/requestHandler';
import { QuestTracker } from '../types/quest';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {loadPinnedQuestPath, pinQuest, setAcceptedQuests} from '../redux/quests/questsSlice';
import {saveItemLocally} from "../utils/SecureStore";
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';

export function removeSpecialChars (input: string) {
  if(input) {
    const text = input.toLowerCase().trim()
    const lower = text.toLowerCase();
    const upper = text.toUpperCase();
    const REGEX_NUMBER = new RegExp('[0-9]+$');
    const REGEX_JAPANESE = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/;
    const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
    let result = "";
    for(let i=0; i<lower.length; ++i) {
      if(REGEX_NUMBER.test(text[i]) || (lower[i] != upper[i]) || (lower[i].trim() === '' || REGEX_CHINESE.test(text[i]) || REGEX_JAPANESE.test(text[i]))) {
        result += text[i];
      }
    }
    return result;
  }
  return '';
}

export default function QuestlogScreen() {

  i18n.translations = commonTranslations;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const pinnedQuest = useAppSelector((state) => state.quests.pinnedQuest);
  const acceptedQuests = useAppSelector((state) => state.quests.acceptedQuests);

  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeExpanded, setActiveExpanded] = React.useState(true);
  const [oldExpanded, setOldExpanded] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [activeQuests, setActiveQuests] = React.useState<QuestTracker[]>([]);
  const [oldQuests, setOldQuests] = React.useState<QuestTracker[]>([]);


  React.useEffect(() => {
    sortTrackers(acceptedQuests);
    setLoading(false);
  }, [acceptedQuests])

  const handleActiveExpanded = () => setActiveExpanded(!activeExpanded);
  const handleOldExpanded = () => setOldExpanded(!oldExpanded);

  const setPinnedQuest = (tracker: QuestTracker) => {
    dispatch(pinQuest(tracker));
    queryTrackerNodesRequest(tracker.trackerId)
      .then(res => res.json())
      .then(res => dispatch(loadPinnedQuestPath(res)))
    saveItemLocally('PinnedQuestTracker', JSON.stringify(tracker)).then(() => {}, () => {});
  }

  const loadQuestObjectiveScreen = useCallback((trackerId: string) => {
    navigation.navigate('GameplayScreen', {
      trackerId: trackerId
    })
  }, [])

  const sortTrackers = (trackers: QuestTracker[]) => {
    if(trackers.length === 0) {
      return;
    }
    let newActive: QuestTracker[] = [];
    let newOld: QuestTracker[] = [];
    trackers.forEach((tracker) =>
      tracker.finished ? newOld.push(tracker) : newActive.push(tracker));
    setActiveQuests(newActive);
    setOldQuests(newOld);
    if(pinnedQuest && !newActive.some((tracker) => tracker.trackerId === pinnedQuest.trackerId)) {
      setPinnedQuest(newActive[0]);
    } else if (!pinnedQuest && newActive.length > 0) {
      setPinnedQuest(newActive[0]);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    getAllTrackersRequest()
      .then((res) => res.json()
        .then((data) => {
          setRefreshing(false);
          sortTrackers(data.trackers);
          dispatch(setAcceptedQuests(data.trackers));
        }))
  }

  const getQuestSearch = (active: boolean) => {
    let newQuests: QuestTracker[] = [];
    const normalizedSearch = removeSpecialChars(search);
    active ?
      activeQuests.map((quest) => {
        const normalizedQuestName = removeSpecialChars(quest.questName);
        const normalizedAuthor = removeSpecialChars(quest.author);
        if(normalizedQuestName.includes(normalizedSearch) || normalizedAuthor.includes(normalizedSearch)) {
          newQuests.push(quest);
        }
      })
      :
      oldQuests.map((quest) => {
        const normalizedQuestName = removeSpecialChars(quest.questName);
        const normalizedAuthor = removeSpecialChars(quest.author);
        if(normalizedQuestName.includes(normalizedSearch) || normalizedAuthor.includes(normalizedSearch)) {
          newQuests.push(quest);
        }
      })
    return newQuests;
  }

  return (
    <View style={styles.container}>
      {
        loading &&
        <View style={styles.loadContainer}>
          <ActivityIndicator size="large" color="#1D79AC"/>
        </View>
      }
      {
        !loading &&
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          stickyHeaderIndices={[1]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text style={styles.header}>
            Questlog
          </Text>
          <View style={styles.searchbar}>
            <Searchbar
              placeholder={i18n.t('searchbarPlaceholder')}
              onChangeText={(input) => setSearch(input)}
              value={search}
              theme={{colors: {primary: Colors.primary}}}
            />
          </View>
          <List.Accordion
            title={i18n.t('activeTitle')}
            description={i18n.t('activeDescription')}
            expanded={activeExpanded}
            onPress={handleActiveExpanded}
            theme={{colors: {primary: Colors.primary}}}
            titleStyle={styles.title}
            descriptionStyle={styles.description}
            left={props => <List.Icon {...props} icon='compass-rose'/>}
          >
            {
              getQuestSearch(true).map((quest) =>
                (pinnedQuest && quest.trackerId === pinnedQuest.trackerId) ?
                  <List.Item
                    title={quest.questName}
                    description={quest.objective}
                    key={quest.trackerId}
                    onPress={() => loadQuestObjectiveScreen(quest.trackerId)}
                    onLongPress={() => setPinnedQuest(quest)}
                    left={() => <List.Icon color={Colors.background} icon='pin'/>}
                    titleStyle={styles.white}
                    descriptionStyle={styles.white}
                    style={styles.trackedActive}
                  />
                  :
                  <List.Item
                    title={quest.questName}
                    description={quest.objective}
                    key={quest.trackerId}
                    onPress={() => loadQuestObjectiveScreen(quest.trackerId)}
                    onLongPress={() => setPinnedQuest(quest)}
                  />
              )
            }
          </List.Accordion>
          <List.Accordion
            title={i18n.t('completedTitle')}
            expanded={oldExpanded}
            onPress={handleOldExpanded}
            theme={{colors: {primary: Colors.primary}}}
            titleStyle={styles.title}
            left={props => <List.Icon {...props} icon='history'/>}
          >
            {
              getQuestSearch(false).map((quest) =>
                <List.Item
                  title={quest.questName}
                  description={quest.author}
                  key={quest.trackerId}
                  onPress={() => loadQuestObjectiveScreen(quest.trackerId)}
                />
              )
            }
          </List.Accordion>
        </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  loadContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight,
  },
  searchbar: {
    justifyContent: 'center',
    padding: 15,
    backgroundColor: Colors.background,
  },
  header: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
  },
  trackedActive: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
  },
  white: {
    color: Colors.background,
  },
});
