import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FAB } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addTrackerExperience,
  loadPinnedQuestPath,
  pinQuest,
  setTrackerFinished,
  setTrackerObjectiveAndTrackerNode,
  setTrackerVote
} from '../redux/quests/questsSlice';
import { GameplayModule, ModuleMememto, QuestPath, QuestTrackerNodeElement } from '../types/quest';
import { playEventChoiceRequest, playVoteRequest, queryTrackerNodesRequest } from '../utils/requestHandler';
import { ModuleRenderer } from './ModuleRenderer';
import { QuestStatsScreen } from './QuestStatsScreen';
import _ from 'lodash';
import { Colors } from '../styles';
import { FinishMessage } from './FinishMessage';
import { addGeofencingRegion, removeUpdatedQuest } from '../utils/TaskManager';
import { useIsFocused } from '@react-navigation/native';

export const GameplayScreen : React.FC = () => {

  const trackerWithUpdates = useAppSelector(state => state.quests.trackerWithUpdates);
  const acceptedQuests = useAppSelector(state => state.quests.acceptedQuests);
  const pinnedQuestPath = useAppSelector(state => state.quests.pinnedQuestPath)
  const pinnedQuest = useAppSelector(state => state.quests.pinnedQuest)
  const route = useRoute<RouteProp<{ params: {
    trackerId: string
  }}, 'params'>>();
  const currentTracker = acceptedQuests.find(tracker => tracker.trackerId === route.params.trackerId);

  const ref = useRef<FlatList>(null);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const [loadedTrackerNodes, setLoadedTrackerNodes] = useState<QuestPath | undefined>();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const [showXp, setShowXp] = useState<boolean>(false);
  const [xpAmount, setXpAmount] = useState<number>(-1);

  const [loadedTrackerNodesList, setLoadedTrackerNodesList] = useState<QuestTrackerNodeElement[]>([]);
  useEffect(() => {
    setLoadedTrackerNodesList(_.reverse(_.clone(loadedTrackerNodes?.trackerNodes || [])))
  }, [loadedTrackerNodes])

  const [innerHeight, setInnerHeight] = useState<number>(Dimensions.get('screen').height);

  useEffect(() => {
    if(isFocused && trackerWithUpdates.includes(route.params.trackerId)) {
      removeUpdatedQuest(route.params.trackerId);
    }
  }, [isFocused])

  useEffect(() => {
    if(trackerWithUpdates.includes(route.params.trackerId)) {
      queryTrackerNodesRequest(route.params.trackerId)
        .then(res => res.json())
        .then(res => {
          setLoadedTrackerNodes(res)
          if(pinnedQuest?.trackerId === route.params.trackerId) {
            dispatch(loadPinnedQuestPath(res))
          }
        })
        .then(() => setHasLoaded(true));
      return;
    }
    if (pinnedQuest?.trackerId === route.params.trackerId && pinnedQuestPath) {
      setLoadedTrackerNodes(pinnedQuestPath)
    } else {
      queryTrackerNodesRequest(route.params.trackerId)
        .then(res => res.json())
        .then(res => setLoadedTrackerNodes(res))
        .then(() => setHasLoaded(true))
    }
  }, [pinnedQuestPath, trackerWithUpdates])

  const updateQuestPath = useCallback((newQuestPath: QuestPath) => {
    const trackerNode = newQuestPath.trackerNodes[newQuestPath.trackerNodes.length-1];
    if (pinnedQuest?.trackerId === route.params.trackerId) {
      dispatch(loadPinnedQuestPath(newQuestPath))

      dispatch(pinQuest({
        ...pinnedQuest,
        trackerNode: {...trackerNode},
        objective: trackerNode.module.objective
      }))
    } else {
      setLoadedTrackerNodes(newQuestPath);
      if(currentTracker) {
        dispatch(setTrackerObjectiveAndTrackerNode({
          trackerId: route.params.trackerId,
          trackerNode: {...trackerNode},
          objective: trackerNode.module.objective
        }));
      }
    }
  }, [pinnedQuest, pinnedQuestPath, route.params.trackerId])

  const handleModuleFinish = useCallback((newModule: GameplayModule, oldMemento: ModuleMememto) => {
    if (!loadedTrackerNodes) {
      console.log('new module without loaded quest')
      return;
    }
    const newQuestPath = _.cloneDeep(loadedTrackerNodes);
    const newTracker = {module: newModule, memento: null, creationTime: (new Date()).toString()}
    newQuestPath.trackerNodes[newQuestPath.trackerNodes.length-1].memento = oldMemento
    newQuestPath.trackerNodes.push(newTracker)
    newQuestPath.quest.tracker.trackerNode = {...newTracker, creationTime: newTracker.creationTime.toString()}

    updateQuestPath(newQuestPath)

    if(newModule.type === 'Location') {
      const newRegion = {
        identifier: currentTracker?.trackerId,
        latitude: newModule.location.latitude,
        longitude: newModule.location.longitude,
        radius: 20,
        notifyOnEnter: true,
        notifyOnExit: false,
      };
      addGeofencingRegion(newRegion);
    }

  }, [loadedTrackerNodes])

  const handleQuestFinish = useCallback((endingFactor: number) => {
    dispatch(setTrackerFinished({ trackerId: route.params.trackerId, finished: true }));
  }, [])

  const handleExperience = useCallback((experience: number) => {
    dispatch(addTrackerExperience({ trackerId: route.params.trackerId, experience: experience }));
    setXpAmount(experience);
    setShowXp(true);
  }, [])

  const resetXp = useCallback(() => {
    setXpAmount(-1);
    setShowXp(false);
  }, [])

  const handleChoiceEvent = useCallback((choiceId=0) =>
    playEventChoiceRequest(route.params.trackerId, choiceId)
      .then(res => res.json())
      .then(res => res.responseEventCollection)
      .then(res => {
        res.responseEvents.forEach(
          (responseEvent: any) => {
            switch (responseEvent.type) {
              case 'ModuleFinish':
                new Promise<void>(resolve => setTimeout(() => resolve(), 1500)).then(() => handleModuleFinish(responseEvent.module, res.memento));
                break;
              case 'Experience':
                handleExperience(responseEvent.experience);
                break;
              case 'QuestFinish':
                new Promise<void>(resolve => setTimeout(() => resolve(), 1500)).then(() => handleQuestFinish(responseEvent.endingFactor));
                break;

            }
          }
        )
      })
  , [route.params, loadedTrackerNodes])

  const handleVote = useCallback((vote: 'None' | 'Up' | 'Down') => {
    return playVoteRequest(route.params.trackerId, vote).then(res => {
      dispatch(setTrackerVote({ trackerId: route.params.trackerId, vote: vote }))
      return res;
    })
  }, [])

  return (
    <View>
      {
        loadedTrackerNodesList.length > 0 &&
        <View>
          {/* avatar image + name, button to quest settings(vote, remove quest) */}

          <FlatList
            data={loadedTrackerNodesList}
            renderItem={
              ({ item, index }) => <ModuleRenderer module={item} index={index} onChoice={handleChoiceEvent} tracker={currentTracker}/>
            }
            ListFooterComponent={<QuestStatsScreen height={innerHeight} quest={loadedTrackerNodes?.quest} flatListRef={ref} trackerId={route.params.trackerId}/>}
            ListHeaderComponent={currentTracker?.finished ? <FinishMessage quest={loadedTrackerNodes?.quest} tracker={currentTracker} handleVote={handleVote}/> : null}
            onLayout={(event) => {
              setInnerHeight(event.nativeEvent.layout.height)
            }}
            ref={ref}
            style={{
              width: '100%',
            }}
            contentContainerStyle={{
              minHeight: '100%',
              width: '100%',
              paddingTop: 50
            }}

            keyExtractor={item => item.module.id.toString()}
            inverted
          />
          {
            showXp && xpAmount !== -1 &&
            <Animatable.View
              animation='fadeOutUp'
              delay={500}
              onAnimationEnd={() => resetXp()}
              style={styles.xpAnimationView}
            >
              <Text style={styles.xpText}>
                +{xpAmount}XP
              </Text>
            </Animatable.View>
          }
          {/* <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          top: 0
        }}

        icon="plus"
        onPress={() => {ref.current?.scrollToEnd()}}
      /> */}

        </View>
      }
      {
        loadedTrackerNodesList.length === 0 &&
        <View style={styles.loadingView}>
          <ActivityIndicator size={'large'} color={Colors.primary}/>
          <Text style={styles.loadingText}>Loading quest</Text>
          {
            hasLoaded &&
            <Text style={styles.loadingError}>
              This is taking longer than usual. The quest may have been deleted by the creator.
              Refresh your Questlog to check if the quest is still there.
            </Text>
          }
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  loadingView: {
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 20,
  },
  loadingError: {
    textAlign: 'center',
    marginTop: 20,
    width: '70%',
    fontSize: 16,
  },
  xpAnimationView: {
    backgroundColor: Colors.background,
    elevation: 5,
    borderRadius: 100,
    position: 'absolute',
    padding: 10,
    right: 30,
    bottom: 120,
  },
  xpText: {
    color: Colors.primary,
    textAlign: 'center',
  },
})
