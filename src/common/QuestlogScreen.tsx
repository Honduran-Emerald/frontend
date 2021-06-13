import React from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import {List, Searchbar} from 'react-native-paper';

import { Colors } from '../styles';
import { commonTranslations } from './translations';
import { getAllTrackersRequest } from '../utils/requestHandler';
import { QuestTracker } from '../types/quest';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { pinQuest } from '../redux/quests/questsSlice';

export default function QuestlogScreen() {

  i18n.translations = commonTranslations;
  const dispatch = useAppDispatch();

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
  }, [])

  const handleActiveExpanded = () => setActiveExpanded(!activeExpanded);
  const handleOldExpanded = () => setOldExpanded(!oldExpanded);

  const setPinnedQuest = (tracker: QuestTracker) => {
    dispatch(pinQuest(tracker));
  }

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
        }))
  }

  const getQuestSearch = (active: boolean) => {
    let newQuests: QuestTracker[] = [];
    const normalizedSearch = search.toLowerCase().trim();
    active ?
      activeQuests.map((quest) => {
        if(quest.questName.toLowerCase().includes(normalizedSearch) || quest.author.toLowerCase().includes(normalizedSearch)) {
          newQuests.push(quest);
        }
      })
      :
      oldQuests.map((quest) => {
        if(quest.questName.toLowerCase().includes(normalizedSearch) || quest.author.toLowerCase().includes(normalizedSearch)) {
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
                    onPress={() => alert('Open Quest objective screen')}
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
                    onPress={() => alert('Open Quest objective screen')}
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
                  onPress={() => alert('Open Quest objective screen')}
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
