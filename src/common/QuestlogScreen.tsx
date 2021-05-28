import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import i18n from 'i18n-js';
import {List, Searchbar} from 'react-native-paper';

import { Colors } from '../styles';
import { commonTranslations } from './translations';

export default function QuestlogScreen() {

  i18n.translations = commonTranslations;

  const [activeExpanded, setActiveExpanded] = React.useState(true);
  const [oldExpanded, setOldExpanded] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [trackedQuestId, setTrackedQuestId] = React.useState(1);

  const handleActiveExpanded = () => setActiveExpanded(!activeExpanded);
  const handleOldExpanded = () => setOldExpanded(!oldExpanded);

  const getActiveSearch = () => {
    let newActive: { id: number; title: string; nextObj: string; ownerName: string; }[] = [];
    const normalizedSearch = search.toLowerCase().trim();
    activeQuests.map((quest) => {
      if(quest.title.toLowerCase().includes(normalizedSearch) || quest.ownerName.toLowerCase().includes(normalizedSearch)) {
        newActive.push(quest);
      }
    })
    return newActive;
  }

  const getOldSearch = () => {
    let newOld: { id: number; title: string; ownerName: string; }[] = [];
    const normalizedSearch = search.toLowerCase().trim();
    oldQuests.map((quest) => {
      if(quest.title.toLowerCase().includes(normalizedSearch) || quest.ownerName.toLowerCase().includes(normalizedSearch)) {
        newOld.push(quest);
      }
    })
    return newOld;
  }

  const activeQuests = [
    {
      id: 1,
      title: 'Find phisn\'s bird',
      nextObj: 'Meet with Oscar',
      ownerName: 'Lenny',
    },
    {
      id: 2,
      title: '24 hours in a Burger King',
      nextObj: 'Order 2 Long Chicken',
      ownerName: 'Leon Mag Schere',
    },
    {
      id: 3,
      title: 'Gotta catch em all',
      nextObj: 'Go to the Luisenplatz Arena',
      ownerName: 'Ash Ketchup',
    },
  ]

  const oldQuests = [
    {
      id: 1,
      title: 'The history of the B Rush',
      ownerName: 'Trillugo',
    },
    {
      id: 2,
      title: '24 hours in a McDonalds',
      ownerName: 'Ronald McDonald',
    },
    {
      id: 3,
      title: 'The history of the B Rush',
      ownerName: 'Trillugo',
    },
    {
      id: 4,
      title: '24 hours in a McDonalds',
      ownerName: 'Ronald McDonald',
    },
    {
      id: 5,
      title: 'The history of the B Rush',
      ownerName: 'Trillugo',
    },
    {
      id: 6,
      title: '24 hours in a McDonalds',
      ownerName: 'Ronald McDonald',
    },
  ]

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}} stickyHeaderIndices={[1]}>
        <Text style={styles.header}>
          Questlog
        </Text>
        <Searchbar
          placeholder={i18n.t('searchbarPlaceholder')}
          onChangeText={(input) => setSearch(input)}
          value={search}
          style={styles.searchbar}
          theme={{ colors: { primary: Colors.primary }}}
        />
        <List.Accordion
          title={i18n.t('activeTitle')}
          description={i18n.t('activeDescription')}
          expanded={activeExpanded}
          onPress={handleActiveExpanded}
          theme={{ colors: { primary: Colors.primary }}}
          titleStyle={styles.title}
          descriptionStyle={styles.description}
          left={props => <List.Icon {...props} icon='compass-rose'/>}
        >
          {
            getActiveSearch().map((quest) =>
              quest.id == trackedQuestId ?
                <List.Item
                  title={quest.title}
                  description={quest.nextObj}
                  key={quest.id}
                  onPress={() => alert('Open Quest objective screen')}
                  onLongPress={() => setTrackedQuestId(quest.id)}
                  left={() => <List.Icon color={Colors.background} icon='pin'/>}
                  titleStyle={styles.white}
                  descriptionStyle={styles.white}
                  style={styles.trackedActive}
                />
                :
                <List.Item
                  title={quest.title}
                  description={quest.nextObj}
                  key={quest.id}
                  onPress={() => alert('Open Quest objective screen')}
                  onLongPress={() => setTrackedQuestId(quest.id)}
                />
            )
          }
        </List.Accordion>
        <List.Accordion
          title={i18n.t('completedTitle')}
          expanded={oldExpanded}
          onPress={handleOldExpanded}
          theme={{ colors: { primary: Colors.primary }}}
          titleStyle={styles.title}
          left={props => <List.Icon {...props} icon='history'/>}
        >
          {
            getOldSearch().map((quest) =>
              <List.Item
                title={quest.title}
                description={quest.ownerName}
                key={quest.id}
                onPress={() => alert('Open Quest objective screen')}
              />
            )
          }
        </List.Accordion>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight,
  },
  searchbar: {
    padding: 15,
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
