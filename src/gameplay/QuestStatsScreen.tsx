import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../styles';
import { GameplayQuestHeader, QuestTracker } from '../types/quest';
import { createDeleteTrackerRequest, playResetRequest, queryTrackerNodesRequest } from '../utils/requestHandler';
import { useNavigation } from '@react-navigation/native';
import { BACKENDIP } from '../../GLOBALCONFIG';
import { Entypo } from '@expo/vector-icons';
import { Button as PaperButton, Button, FAB, Modal, Portal, Surface } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadPinnedQuestPath, pinQuest, removeAcceptedQuest, updateAcceptedQuest } from '../redux/quests/questsSlice';
import { addGeofencingRegion, SingleGeoFenceLocationRadius, updateGeofencingTask } from '../utils/TaskManager';

interface QuestStateScreenProps {
  height: number,
  quest: GameplayQuestHeader | undefined,
  flatListRef: React.RefObject<FlatList<any>>,
  trackerId: string,
  currentTracker: QuestTracker|undefined,
}

export const QuestStatsScreen: React.FC<QuestStateScreenProps> = ({ height, quest, flatListRef, trackerId, currentTracker }) => {

  const pinnedQuest = useAppSelector((state) => state.quests.pinnedQuest);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [resetModal, setResetModal] = React.useState(false);
  const [voteModal, setVoteModal] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const showResetModal = () => setResetModal(true);
  const hideResetModal = () => setResetModal(false);
  const showVoteModal = () => setVoteModal(true);
  const hideVoteModal = () => setVoteModal(false);

  const resetQuest = () => {
    playResetRequest(trackerId).then((res) => {
      if(res.status === 200) {
        queryTrackerNodesRequest(trackerId)
          .then((res) => res.json()
            .then((data) => {
              const newTracker = data.quest.tracker;
              if(pinnedQuest && trackerId === pinnedQuest.trackerId){
                dispatch(loadPinnedQuestPath(data))
                dispatch(pinQuest(newTracker));
              }
              dispatch(updateAcceptedQuest(newTracker));
              if(data.quest.tracker.trackerNode.module.type === 'Location') {
                const newRegion = {
                  identifier: data.quest.tracker.trackerId,
                  latitude: data.quest.tracker.trackerNode.module.location.latitude,
                  longitude: data.quest.tracker.trackerNode.module.location.longitude,
                  radius: SingleGeoFenceLocationRadius,
                  notifyOnEnter: true,
                  notifyOnExit: false,
                };
                addGeofencingRegion(newRegion);
              }
            })
          )
      }
      else {
        alert('Error ' + res.status);
      }
      hideResetModal();
    }).then(() => navigation.goBack())
  }

  const removeQuest = () => {
    createDeleteTrackerRequest(trackerId).then((res) => {
      if(res.status === 200) {
        dispatch(removeAcceptedQuest(trackerId));
        if(currentTracker?.trackerNode.module.type === 'Location') {
          updateGeofencingTask(trackerId);
        }
      } else {
        alert('Error while removing.');
      }
      hideModal();
    }).then(() => navigation.goBack())
  }

  const voteQuest = () => {
    hideVoteModal();
  }

  return (
    <View style={[styles.stats, {height: height, flexGrow: 1, alignItems: 'center'}]}>

      <View>
        <View>
          {
            quest?.imageId &&
            <Image style={styles.image} source={{uri: `${BACKENDIP}/image/get/${quest.imageId}`}}/>
          }
          {
            !quest?.imageId &&
            <Image style={styles.image} source={require('../../assets/background.jpg')}/>
          }
        </View>

        <View style={styles.info}>
          <View style={styles.location}>
            <Entypo name='location-pin' size={24} color='black' style={styles.icon}/>
            <Text>
              {quest?.locationName}
            </Text>
          </View>
          <View style={styles.time}>
            <Entypo name='stopwatch' size={24} color='black' style={styles.icon}/>
            <Text>
              {quest?.approximateTime}
            </Text>
          </View>
        </View>
      </View>


      <Surface style={styles.block}>
        <Text style={styles.description} ellipsizeMode={'tail'} numberOfLines={10}>
          {quest?.description}
        </Text>
      </Surface>

      <View style={{flexDirection: "row"}}>
        <View>
          <FAB
            style={[styles.button, {marginRight: 10,}]}
            small
            icon="restart"
            onPress={() => showResetModal()}
            label={"Restart"}
          />
        </View>
        <View>
          <FAB
            style={styles.button}
            small
            icon="delete-forever"
            onPress={() => showModal()}
            label={"Abandon"}
          />
        </View>
      </View>

      <FAB
        style={[styles.button, {marginTop: -20}]}
        small
        icon="vote"
        onPress={() => {showVoteModal()}}
        label={"Vote"}
      />

      <View style={styles.downView}>
        <FAB
          style={styles.goDown}
          small
          icon="chevron-down"
          onPress={() => {flatListRef.current?.scrollToOffset({
            offset: 0
          })}}
        />
      </View>


      <Portal>
        <Modal visible={modalVisible || resetModal || voteModal} dismissable onDismiss={resetModal ? hideResetModal : (voteModal ? hideVoteModal : hideModal)} contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>
            {resetModal ? 'Restart this quest?' : (voteModal ? 'Vote for this quest' : 'Abandon this quest?')}
          </Text>
          <Text style={styles.modalText}>
            {
              resetModal ?
                'This will reset all progress for this quest and automatically update to the newest version available.\nThe quest will stay in the Questlog.'
                :
                  (
                      voteModal ?
                      'insert vote text'
                      :
                      'This will reset all progress and remove the quest from the Questlog. You may accept the quest again at a later time.'
                  )
            }
          </Text>
          <View style={styles.modalButtons}>
            <View style={styles.modalButton}>
              <PaperButton color={Colors.primary} compact mode={'contained'} onPress={() => resetModal ? resetQuest() : (voteModal ? voteQuest() : removeQuest())}>
                {resetModal ? 'restart' : (voteModal ? 'vote' : 'Abandon')}
              </PaperButton>
            </View>
          </View>
          <View style={styles.modalBackButton}>
            <PaperButton color={Colors.primary} compact onPress={resetModal ? hideResetModal : (voteModal ? hideVoteModal : hideModal)}>{'Back'}</PaperButton>
          </View>
        </Modal>
      </Portal>

    </View>
  )
}

const styles = StyleSheet.create({
  stats: {
    backgroundColor: Colors.background,
    padding: 0,
    margin: 0,
    borderTopWidth: 0,
    marginBottom: 20,
    elevation: 5,
    width: "100%",
    justifyContent: "center",
  },
  image: {
    width: Dimensions.get('screen').width * 0.8,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  info: {
    width: Dimensions.get('screen').width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    marginRight: "auto",
    maxWidth: '45%',
  },
  time: {
    flexDirection: 'row',
    marginRight: 3,
    maxWidth: '45%',
  },
  block: {
    margin: 20,
    width: Dimensions.get('screen').width * 0.9,
    padding: 15,
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
  icon: {
    marginRight: 5,
    marginTop: -5,
  },
  goUp: {

  },
  downView: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  goDown: {
    backgroundColor: Colors.primary,
  },
  button: {
    marginBottom: 30,
    backgroundColor: Colors.primary,
  },
  modal: {
    backgroundColor: Colors.background,
    padding: 20,
    margin: 20,
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
})
