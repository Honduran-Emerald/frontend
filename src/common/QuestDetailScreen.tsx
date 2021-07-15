import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableNativeFeedback, StatusBar, Alert } from 'react-native';
import i18n from 'i18n-js';
import { Entypo } from '@expo/vector-icons';
import { Avatar, Modal, Portal, Surface, Button } from 'react-native-paper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import { Colors } from '../styles';
import { commonTranslations } from './translations';
import { QueriedQuest, QuestTracker } from '../types/quest';
import { createDeleteQuestRequest, createPublishRequest, createTrackerRequest, queryQuestsWithIds } from '../utils/requestHandler';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { acceptQuest, addRecentlyVisitedQuest, refreshRecentlyVisitedQuest, removeRecentlyVisitedQuest } from '../redux/quests/questsSlice';
import { User } from '../types/general';
import { BACKENDIP } from '../../GLOBALCONFIG';
import { getImageAddress } from '../utils/imageHandler';
import { addGeofencingRegion, SingleGeoFenceLocationRadius } from '../utils/TaskManager';
import { storeData } from '../utils/AsyncStore';

export default function QuestDetailScreen({ route, navigation }: any) {

  i18n.translations = commonTranslations;

  const user: User | undefined = useAppSelector((state) => state.authentication.user);
  const acceptedQuests: QuestTracker[] = useAppSelector((state) => state.quests.acceptedQuests);
  const recentQuests: QueriedQuest[] = useAppSelector((state) => state.quests.recentlyVisitedQuests);

  const acceptedIds: string[] = acceptedQuests.map(tracker => tracker.questId);
  const isAccepted: boolean = acceptedIds.includes(route.params.quest.id);
  const dispatch = useAppDispatch();
  //const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [quest, setQuest] = React.useState(route.params.quest);
  const [isDraft,] = React.useState(route.params.isDraft ? route.params.isDraft : undefined);

  const isQuestCreator = quest.ownerId === user?.userId;
  const creationDate = quest.creationTime ?  new Date(Date.parse(quest.creationTime)) : new Date();
  const finishRate: number = quest.plays ? ((quest.finishes / quest.plays) * 100) : 0;

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  React.useEffect(() => {
    async function updateRecentQuests() {
      if(!recentQuests.find((q) => q.id === quest.id)) {
        const tmp = _.cloneDeep(recentQuests)
        if(tmp.length > 19) {
          tmp.splice(0, 1);
        }
        tmp.push(quest);
        await storeData('RecentlyVisitedQuests', JSON.stringify(tmp)).then(() => {}, () => {});
        dispatch(addRecentlyVisitedQuest(quest));
      } else {
        const tmp = recentQuests.filter((curQuest) => quest.id !== curQuest.id);
        tmp.push(quest);
        await storeData('RecentlyVisitedQuests', JSON.stringify(tmp)).then(() => {}, () => {});
        dispatch(refreshRecentlyVisitedQuest(quest))
      }
    }

    if(quest.released && !isDraft && isFocused) {
      console.log('refresh')
      queryQuestsWithIds(quest.id)
        .then((res) => {
          if(res.status === 200) {
            res.json().then((data) => setQuest(data[0]))
          } else {
            console.log('error while refreshing ' + res.status);
          }
        })
        .then(() => updateRecentQuests().then(() => {}))
    }
  }, [isFocused])

  const loadQuestObjectiveScreen = (tracker: QuestTracker | undefined) => {
    if(tracker) {
      navigation.navigate('Questlog', {
        screen: 'GameplayScreen',
        initial: false,
        params: {
          trackerId: tracker.trackerId,
          tracker: tracker,
        }
      })
    } else {
      alert('Cannot load quest')
    }
  }

  const handleAccept = () => {
    setIsButtonDisabled(true);
    createTrackerRequest(quest.id)
      .then((res) => {
        if(res.status === 200) {
          res.json()
            .then((data) => {
              setIsButtonDisabled(false);
              dispatch(acceptQuest(data.trackerModel));
              if (data.trackerModel.trackerNode.module.type === 'Location') {
                const newRegion = {
                  identifier: data.trackerModel.trackerId,
                  latitude: data.trackerModel.trackerNode.module.location.latitude,
                  longitude: data.trackerModel.trackerNode.module.location.longitude,
                  radius: SingleGeoFenceLocationRadius,
                  notifyOnEnter: true,
                  notifyOnExit: false,
                };
                addGeofencingRegion(newRegion);
              }
              loadQuestObjectiveScreen(data.trackerModel);
            })
        } else {
          if(recentQuests.find((q) => q.id === quest.id)) {
            dispatch(removeRecentlyVisitedQuest(quest.id));
            const tmp = recentQuests.filter((q) => q.id !== quest.id);
            storeData('RecentlyVisitedQuests', JSON.stringify(tmp)).then(() => {}, () => {});
          }
          alert('Error while accepting. Quest may have been deleted.');
          navigation.goBack();
        }
      })
  };

  const handlePublish = () => {
    createPublishRequest(quest.id)
      .then(res => {
        if (res.status === 200) {
          setQuest({...quest, released: true, outdated: false});
          Alert.alert('Quest released', 'Your quest was successfully released. Players can now find it using their home screen.')
        } else {
          Alert.alert('Release failed', 'Check your quest for completeness.')
        }
      })
      .then(() => queryQuestsWithIds(quest.id)
        .then((res) => {
          if(res.status === 200) {
            res.json().then((data) => setQuest(data[0]))
          } else {
            console.log('error while refreshing ' + res.status);
          }
        }))
  }

  const handleDelete = () => {
    createDeleteQuestRequest(quest.id).then(res => {
      if(res.status === 200) {
        if(recentQuests.find((q) => q.id === quest.id)) {
          dispatch(removeRecentlyVisitedQuest(quest.id));
          const tmp = recentQuests.filter((q) => q.id !== quest.id);
          storeData('RecentlyVisitedQuests', JSON.stringify(tmp)).then(() => {}, () => {});
        }
        alert('Quest deleted');
        hideModal();
      } else {
        alert('Server Error ' + res.status);
      }
    }).then(() => navigation.goBack())
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.scrollView}>
          <View style={styles.spacer}/>
          <Text style={styles.header}>
            {quest.title}
          </Text>
          {
            quest.imageId &&
            <Image style={styles.image} source={{uri: `${BACKENDIP}/image/get/${quest.imageId}`}}/>
          }
          {
            !quest.imageId &&
            <Image style={styles.image} source={require('../../assets/Logo_Full_Black.png')}/>
          }
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
          <Surface style={styles.block}>
            <Text style={styles.description}>
              {quest.description}
            </Text>
          </Surface>
          {
            !isAccepted &&
            <View style={styles.button}>
              <Button color={Colors.primary} disabled={isButtonDisabled || !quest.released || isDraft} onPress={handleAccept} mode={'contained'}>
                {i18n.t('acceptButton')}
              </Button>
            </View>
          }
          {
            isAccepted &&
            <View style={styles.button}>
              <Button
                color={'green'}
                disabled={isButtonDisabled || isDraft}
                onPress={() => loadQuestObjectiveScreen(acceptedQuests.find(tracker => tracker.questId === quest.id))}
                mode={'contained'}
              >
                {(quest.tracker && quest.tracker.finished) ? 'Finished' : 'Continue'}
              </Button>
            </View>
          }
          {
            isQuestCreator &&
            <View style={{width: '100%'}}>
              {
                (quest.released && quest.outdated) &&
                <Text style={{textAlign: 'center', width: '100%', marginBottom: 10, marginTop: -15, }}>
                  New version available for release!
                </Text>
              }
              <View style={styles.creatorButtons}>
                <View style={styles.creatorButton}>
                  <Button
                    color={Colors.primary}
                    disabled={isButtonDisabled}
                    onPress={() => navigation.navigate('QuestEditorScreen', {
                      questId: quest.id
                    })}
                    mode={'contained'}
                  >
                    {i18n.t('editButton')}
                  </Button>
                </View>
                <View style={styles.creatorButton}>
                  <Button
                    color={Colors.primary}
                    disabled={isButtonDisabled || (quest.released && !quest.outdated)}
                    onPress={() => handlePublish()}
                    mode={'contained'}
                  >
                    {'Release'}
                  </Button>
                </View>
              </View>
              <View style={styles.creatorButtons}>
                <View style={styles.creatorButton}>
                  <Button color={Colors.error} disabled={isButtonDisabled} onPress={showModal} mode={'contained'}>
                    {i18n.t('deleteButton')}
                  </Button>
                </View>
              </View>
            </View>
          }
          <View style={styles.divider}/>
          <View style={styles.stats}>
            <View style={styles.center}>
              <Text style={styles.mediumText}>
                {quest.votes ? quest.votes : 0}
              </Text>
              <Text style={styles.smallText}>
                {i18n.t('votes')}
              </Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.mediumText}>
                {quest.plays ? quest.plays : 0}
              </Text>
              <Text style={styles.smallText}>
                {i18n.t('plays')}
              </Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.mediumText}>
                {isNaN(finishRate) ? '0.00' : finishRate.toFixed(2)}%
              </Text>
              <Text style={styles.smallText}>
                {i18n.t('finished')}
              </Text>
            </View>
          </View>
          <TouchableNativeFeedback onPress={() => { navigation.push('UserProfile', {screen: 'Profile', params: {userId: quest.ownerId}}) }}>
            <View style={styles.authorView}>
              <Avatar.Image
                style={styles.authorAvatar}
                theme={{colors: {primary: Colors.primary}}}
                source={{uri: getImageAddress(quest.ownerImageId, quest.ownerName)}}
              />
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
          <Text style={styles.modalTitle}>
            {i18n.t('modalDeleteTitle')}
          </Text>
          <Text style={styles.modalText}>
            {i18n.t('modalDeleteText')}
          </Text>
          <View style={styles.modalButtons}>
            <View style={styles.modalButton}>
              <Button color={Colors.error} compact mode={'contained'} onPress={() => handleDelete()}>{i18n.t('modalDeleteButton')}</Button>
            </View>
          </View>
          <View style={styles.modalBackButton}>
            <Button color={Colors.primary} compact onPress={hideModal}>{i18n.t('modalBackButton')}</Button>
          </View>
        </Modal>
      </Portal>
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
    width: '90%',
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
    width: '88.8%',
    height: Dimensions.get('window').height * 0.25,
    borderRadius: 20,
    marginBottom: 15,
  },
  info: {
    width: '88.8%',
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
  block: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 25,
  },
  description: {
    textAlign: 'left',
  },
  button: {
    width: '40%',
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
    marginRight: 10,
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
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
  modalButtons: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalButton: {
    width: '48%',
  },
  modalBackButton: {
    alignItems: 'flex-start',
  },
});
