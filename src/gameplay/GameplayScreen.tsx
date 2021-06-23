import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { FlatList } from 'react-native';
import { FAB } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadPinnedQuestPath, pinQuest } from '../redux/quests/questsSlice';
import { GameplayModule, ModuleMememto, QuestPath, QuestTrackerNodeElement } from '../types/quest';
import { playEventChoiceRequest, queryTrackerNodesRequest } from '../utils/requestHandler';
import { ModuleRenderer } from './ModuleRenderer';
import { QuestStatsScreen } from './QuestStatsScreen';
import _ from 'lodash';

export const GameplayScreen : React.FC = () => {

  const pinnedQuestPath = useAppSelector(state => state.quests.pinnedQuestPath)
  const pinnedQuest = useAppSelector(state => state.quests.pinnedQuest)
  const route = useRoute<RouteProp<{ params: {
    trackerId: string
  }}, 'params'>>();

  const ref = useRef<FlatList>(null);
  const dispatch = useAppDispatch();

  const [loadedTrackerNodes, setLoadedTrackerNodes] = useState<QuestPath | undefined>()

  const [loadedTrackerNodesList, setLoadedTrackerNodesList] = useState<QuestTrackerNodeElement[]>([]);
  useEffect(() => {
    setLoadedTrackerNodesList(_.reverse(_.clone(loadedTrackerNodes?.trackerNodes || [])))
  }, [loadedTrackerNodes])

  const [innerHeight, setInnerHeight] = useState<number>(Dimensions.get('screen').height);

  useEffect(() => {
    if (pinnedQuest?.trackerId === route.params.trackerId && pinnedQuestPath) {
      setLoadedTrackerNodes(pinnedQuestPath)
    } else {
      queryTrackerNodesRequest(route.params.trackerId)
        .then(res => res.json())
        .then(res => setLoadedTrackerNodes(res))
    }
  }, [pinnedQuestPath])

  const updateQuestPath = useCallback((newQuestPath: QuestPath) => {
    if (pinnedQuest?.trackerId === route.params.trackerId && pinnedQuestPath) {
      dispatch(loadPinnedQuestPath(newQuestPath))
      const trackerNode = newQuestPath.trackerNodes[newQuestPath.trackerNodes.length-1]
      dispatch(pinQuest({
        ...pinnedQuest,
        trackerNode: {...trackerNode, createdAt: trackerNode.creationTime.toString(), id: '0'},
        objective: trackerNode.module.objective}))
    } else {
      setLoadedTrackerNodes(newQuestPath)
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
    newQuestPath.quest.tracker.trackerNode = {...newTracker, id: '0', createdAt: newTracker.creationTime.toString()}

    updateQuestPath(newQuestPath)

  }, [loadedTrackerNodes])

  const handleChoiceEvent = useCallback((choiceId=0) =>
    playEventChoiceRequest(route.params.trackerId, choiceId)
      .then(res => res.json())
      .then(res => res.responseEventCollection)
      .then(res => {
        res.responseEvents.forEach(
          (responseEvent: any) => {
            switch (responseEvent.type) {
              case 'ModuleFinish':
                handleModuleFinish(responseEvent.module, res.memento)
                break;
              case 'Experience':
                console.log('Experience', responseEvent)
                break;
              case 'QuestFinish':
                console.log('Quest Finish', responseEvent)
                break;

            }
          }
        )
      })
  , [route.params, loadedTrackerNodes])

  return (
    <View>
      {/* avatar image + name, button to quest settings(vote, remove quest) */}

      <FlatList
        data={loadedTrackerNodesList}
        renderItem={
          ({ item, index }) => <ModuleRenderer module={item} index={index} onChoice={handleChoiceEvent} />
        }
        ListFooterComponent={<QuestStatsScreen height={innerHeight} quest={loadedTrackerNodes?.quest} flatListRef={ref} trackerId={route.params.trackerId}/>}
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
  )
}
