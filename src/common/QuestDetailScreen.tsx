import React from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, Dimensions, TouchableNativeFeedback, StatusBar} from 'react-native';
import i18n from 'i18n-js';
import { Entypo } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';

import { Colors } from '../styles';
import { commonTranslations } from './translations';
import { QuestHeader } from '../types/quest';

export default function QuestDetailScreen({ route }: any) {

  i18n.translations = commonTranslations;

  // TODO location, author, approx time missing, image fetch needed
  // route.params ?  route.params.quest :
  // approximateTime: "2 hours",
  const quest: QuestHeader = {
    id: "51243",
    ownerId: "8127549",
    ownerImageId: "",
    ownerName: "",
    tags: [],
    profileImageId: "",
    profileName: "",
    locationName: "",
    public: true,
    title: "Find phisn's bird",
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    imageId: "87132984761298",
    version: 7,
    creationTime: "2021-05-18T18:14:12.793Z",
    votes: 356,
    plays: 1425,
    finishes: 780,
    location: {
      longitude: 49.873219,
      latitude: 8.650930
    }
  };

  const creationDate = new Date(Date.parse(quest.creationTime));

  const handleAccept = () => {
    // TODO implement
    alert('Add quest to quest log');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.scrollView}>
          <View style={styles.spacer}/>
          <Text style={styles.header}>
            {quest.title}
          </Text>
          <Image style={styles.image} source={{uri: 'https://wildlife.org/wp-content/uploads/2015/08/Honduran-Emerald-Hummingbird-Image-Credit-Dominic-Sherony.jpg'}}/>
          <View style={styles.info}>
            <Entypo name='location-pin' size={24} color='black'/>
            <Text style={styles.location}>
              Darmstadt, Luisenplatz
            </Text>
            <Entypo name='stopwatch' size={24} color='black'/>
            <Text style={styles.time}>
              2 hours
            </Text>
          </View>
          <Text style={styles.description}>
            {quest.description}
          </Text>
          <View style={styles.button}>
            <Button color={Colors.primary} title={i18n.t('acceptButton')} onPress={handleAccept}/>
          </View>
          <View style={styles.divider}/>
          <View style={styles.stats}>
            <View style={styles.center}>
              <Text style={styles.mediumText}>
                {quest.votes}
              </Text>
              <Text style={styles.smallText}>
                {i18n.t('votes')}
              </Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.mediumText}>
                {quest.plays}
              </Text>
              <Text style={styles.smallText}>
                {i18n.t('plays')}
              </Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.mediumText}>
                {quest.finishes}
              </Text>
              <Text style={styles.smallText}>
                {i18n.t('finished')}
              </Text>
            </View>
          </View>
          {
            // TODO implement go to profile navigation
          }
          <TouchableNativeFeedback onPress={() => { alert('Go to profile') }}>
            <View style={styles.authorView}>
              <Avatar.Image style={styles.authorAvatar} source={{uri: 'https://pbs.twimg.com/profile_images/1214590755706150913/Jm78BGWD_400x400.jpg'}}/>
              <View>
                <Text style={styles.authorName}>
                  Trillugo
                </Text>
                <Text style={styles.smallText}>
                  {`${creationDate.getDate()}.${creationDate.getMonth() + 1}.${creationDate.getFullYear()}`}
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
          <View style={styles.spacer}/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight,
  },
  scrollContainer: {
    width: '100%',
  },
  scrollView: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 15,
  },
  header: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
    borderRadius: 20,
    marginBottom: 15,
  },
  info: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  location: {
    fontSize: 15,
    marginRight: 'auto',
    maxWidth: '45%',
  },
  time: {
    fontSize: 15,
    marginLeft: 3,
    maxWidth: '45%',
  },
  description: {
    textAlign: 'left',
    marginBottom: 15,
  },
  button: {
    width: '50%',
    marginBottom: 25,
  },
  divider: {
    borderBottomColor: Colors.black,
    borderBottomWidth: 2,
    width: '90%',
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    width: '100%',
  },
  center: {
    alignItems: 'center',
  },
  authorView: {
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  authorAvatar: {
    marginRight: 5,
  },
  authorName: {
    fontSize: 20,
  },
  mediumText: {
    fontSize: 20,
    color: Colors.primary,
    marginBottom: -5
  },
  smallText: {
    fontSize: 10,
  },
});
