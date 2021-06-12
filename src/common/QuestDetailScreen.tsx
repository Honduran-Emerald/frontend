import React from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, Dimensions, TouchableNativeFeedback, StatusBar} from 'react-native';
import i18n from 'i18n-js';
import { Entypo } from '@expo/vector-icons';
import { Avatar, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';

import { Colors } from '../styles';
import { commonTranslations } from './translations';
import { QuestHeader, QuestTracker } from '../types/quest';
import { createTrackerRequest } from '../utils/requestHandler';
import { store } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { acceptQuest } from '../redux/quests/questsSlice';
import { User } from '../types/general';

export default function QuestDetailScreen({ route }: any) {

  const user: User | undefined = useAppSelector((state) => state.authentication.user);

  i18n.translations = commonTranslations;
  const acceptedQuests: QuestTracker[] = store.getState().quests.acceptedQuests;
  const acceptedIds: string[] = acceptedQuests.map(tracker => tracker.questId)
  const isAccepted: boolean = acceptedIds.includes(route.params.quest.id);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const quest: QuestHeader = route.params.quest;
  const isQuestCreator = quest.ownerName === user?.userName;
  const creationDate = new Date(Date.parse(quest.creationTime));
  const finishRate: number = ((quest.finishes / quest.plays) * 100)

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // TODO image fetch needed, translation for creator buttons and modal

  const handleAccept = () => {
    setIsButtonDisabled(true);
    createTrackerRequest(quest.id)
      .then((res) => res.json()
        .then((data) => {
          navigation.navigate('MapScreen');
          setIsButtonDisabled(false);
          dispatch(acceptQuest(data.trackerModel));
        }))
  };

  return (
    <PaperProvider>
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
                {quest.locationName}
              </Text>
              <Entypo name='stopwatch' size={24} color='black'/>
              <Text style={styles.time}>
                {quest.approximateTime}
              </Text>
            </View>
            <Text style={styles.description}>
              {quest.description}
            </Text>
            {
              !isAccepted &&
              <View style={styles.button}>
                <Button color={Colors.primary} disabled={isButtonDisabled} title={i18n.t('acceptButton')} onPress={handleAccept}/>
              </View>
            }
            {
              isAccepted &&
              <View style={styles.acceptedText}>
                <MaterialCommunityIcons name='check' size={24} color='green'/>
                <Text style={{color: 'green'}}>{i18n.t('questAccepted')}</Text>
              </View>
            }
            {
              isQuestCreator &&
              <View style={styles.creatorButtons}>
                <View style={styles.creatorButton}>
                  <Button color={Colors.primary} disabled={isButtonDisabled} title={'Edit Quest'} onPress={() => alert('Go to edit screen')}/>
                </View>
                <View style={styles.creatorButton}>
                  <Button color={Colors.error} disabled={isButtonDisabled} title={'Delete Quest'} onPress={showModal}/>
                </View>
              </View>
            }
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
                  {isNaN(finishRate) ? '0' : finishRate.toFixed(0)}%
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
                    {quest.ownerName}
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
        <Portal>
          <Modal visible={modalVisible} dismissable onDismiss={hideModal} contentContainerStyle={styles.modal}>
            <Text style={{fontSize: 24, textAlign: 'center', marginBottom: 15}}>
              Delete Quest?
            </Text>
            <Text style={{fontSize: 16}}>
              Do you really want to permanently delete this quest?
            </Text>
            <Text style={{fontSize: 16}}>
              If you just want to hide the quest, you may set it to private.
            </Text>
            <View style={styles.modalButtons}>
              <View style={styles.modalButton}>
                <Button color={Colors.primaryLight} title={'Set to private'} onPress={() => alert('Implement set to private')}/>
              </View>
              <View style={styles.modalButton}>
                <Button color={Colors.primary} title={'Back'} onPress={hideModal}/>
              </View>
              <View style={styles.modalButton}>
                <Button color={Colors.error} title={'Delete Quest'} onPress={() => alert('Implement delete')}/>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
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
  acceptedText: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 25,
  },
  creatorButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  creatorButton: {
    width: '40%',
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
  modal: {
    backgroundColor: Colors.background,
    padding: 20,
    margin: 20,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  modalButton: {
    width: '30%',
  },
});
