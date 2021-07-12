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

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const showResetModal = () => setResetModal(true);
  const hideResetModal = () => setResetModal(false);

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

  /*
  <Text style={{
        padding: 50
      }}
      ellipsizeMode={'tail'}
      numberOfLines={15}>
        {JSON.stringify(quest)}
      </Text>
   */

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
            label={"Reset progress"}
          />
        </View>
        <View>
          <FAB
            style={styles.button}
            small
            icon="delete-forever"
            onPress={() => showModal()}
            label={"Remove quest"}
          />
        </View>
      </View>

      <FAB
        style={[styles.button, {marginTop: -20}]}
        small
        icon="vote"
        onPress={() => {resetQuest()}}
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
        <Modal visible={modalVisible || resetModal} dismissable onDismiss={resetModal ? hideResetModal : hideModal} contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>
            {resetModal ? 'Reset this Quest?' : 'Remove from Questlog?'}
          </Text>
          <Text style={styles.modalText}>
            {
              resetModal ?
                'This will reset all progress for this quest and update to the newest version if the creator updated this quest. It will stay in your Questlog and you immediately start again'
                :
                'This will delete all progress for this quest. You may accept the quest again at a later time'
            }
          </Text>
          <View style={styles.modalButtons}>
            <View style={styles.modalButton}>
              <PaperButton color={Colors.error} compact mode={'contained'} onPress={() => resetModal ? resetQuest() : removeQuest()}>
                {resetModal ? 'Reset Quest' : 'Remove Quest'}
              </PaperButton>
            </View>
          </View>
          <View style={styles.modalBackButton}>
            <PaperButton color={Colors.primary} compact onPress={resetModal ? hideResetModal : hideModal}>{'Back'}</PaperButton>
          </View>
        </Modal>
      </Portal>

    </View>
  )
}

/*
<View style={{position: 'absolute', bottom: 10}}>
        <Button style={styles.goUp} icon={"chevron-up"} onPress={() => {flatListRef.current?.scrollToOffset({
          offset: 100000000,
        })}} color={Colors.primary}>
          View Quest Details
        </Button>
      </View>
 */
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
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
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
