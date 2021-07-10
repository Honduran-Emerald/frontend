import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import i18n from 'i18n-js';
import { List, Searchbar } from 'react-native-paper';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';

import { Colors } from '../styles';
import { commonTranslations } from '../common/translations';
import { getAllTrackersRequest } from '../utils/requestHandler';
import { QuestTracker } from '../types/quest';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { pinQuest, setAcceptedQuests } from '../redux/quests/questsSlice';
import { storeData } from '../utils/AsyncStore';

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
  const trackerWithUpdates = useAppSelector((state) => state.quests.trackerWithUpdates);

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
    if(tracker) dispatch(pinQuest(tracker));
    storeData('PinnedQuestTracker', JSON.stringify(tracker)).then(() => {}, () => {});
  }

  const loadQuestObjectiveScreen = useCallback((trackerId: string) => {
    navigation.navigate('GameplayScreen', {
      trackerId: trackerId,
      tracker: acceptedQuests.find(tracker => tracker.trackerId === trackerId),
    })
  }, [acceptedQuests])

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
        <View style={styles.headerView}>
            <Text style={styles.header}>
                Questlog
            </Text>
        </View>
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
            style={styles.backgroundWhite}
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
                    right={() => trackerWithUpdates.includes(quest.trackerId) ? <List.Icon color={Colors.background} icon={'email-alert'}/> : null}
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
                    left={() => <List.Icon color={Colors.background} icon='pin'/>}
                    right={() => trackerWithUpdates.includes(quest.trackerId) ? <List.Icon color={Colors.primary} icon={'email-alert'}/> : null}
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
            style={styles.backgroundWhite}
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
          <View style={{paddingBottom: 40}}/>
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
    textAlign: 'left',
    fontWeight: "600",
    includeFontPadding: true,
    fontSize: 20,
    top: 14,
    left: 16,
    height: 50,
  },
  headerView: {
    height: 55,
    backgroundColor: Colors.background,
    elevation: 5,
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
  backgroundWhite: {
    backgroundColor: Colors.background,
  },
});
