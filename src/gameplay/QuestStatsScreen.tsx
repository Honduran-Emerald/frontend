import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import { Colors } from '../styles';
import { GameplayQuestHeader } from '../types/quest';
import { playResetRequest, queryTrackerNodesRequest } from '../utils/requestHandler';
import { useNavigation } from '@react-navigation/native';
import { BACKENDIP } from '../../GLOBALCONFIG';
import { Entypo } from '@expo/vector-icons';
import {Button, FAB, Surface} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadPinnedQuestPath, pinQuest, updateAcceptedQuest } from '../redux/quests/questsSlice';
import {addGeofencingRegion} from "../utils/TaskManager";

interface QuestStateScreenProps {
  height: number,
  quest: GameplayQuestHeader | undefined,
  flatListRef: React.RefObject<FlatList<any>>,
  trackerId: string
}

export const QuestStatsScreen: React.FC<QuestStateScreenProps> = ({ height, quest, flatListRef, trackerId }) => {

  const pinnedQuest = useAppSelector((state) => state.quests.pinnedQuest);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

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
                  radius: 20,
                  notifyOnEnter: true,
                };
                addGeofencingRegion(newRegion);
              }
            })
          )
      }
      else alert('Error ' + res.status);
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
    <View style={[styles.stats, {height: height + 40, flexGrow: 1, alignItems: 'center'}]} >

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

      <Surface style={styles.block}>
        <Text style={styles.description} ellipsizeMode={'tail'} numberOfLines={10}>
          {quest?.description}
        </Text>
      </Surface>

      <FAB
        style={styles.reset}
        small
        icon="restart"
        onPress={() => {resetQuest()}}
        label={"Reset all progress for quest"}
      />
      <FAB
        style={styles.reset}
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
      <View style={{position: 'absolute', bottom: 10}}>
        <Button style={styles.goUp} icon={"chevron-up"} onPress={() => {flatListRef.current?.scrollToOffset({
          offset: 100000000,
        })}} color={Colors.primary}>
          View Quest Details
        </Button>
      </View>

    </View>
  )
}

/*

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
  },
  image: {
    width: Dimensions.get('screen').width * 0.8,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 25,
  },
  info: {
    width: Dimensions.get('screen').width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
    bottom: 70,
    right: 20,
  },
  goDown: {
    backgroundColor: Colors.primary,
  },
  reset: {
    marginBottom: 30,
    backgroundColor: Colors.primary,
  },
})
