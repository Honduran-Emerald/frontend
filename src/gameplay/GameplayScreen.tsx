import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { Text } from 'react-native';
import { FlatList } from 'react-native';
import { FAB } from 'react-native-paper';
import { Transition } from 'react-native-reanimated';
import { useAppSelector } from '../redux/hooks';
import { PrototypeModule, QuestPath, QuestTracker, QuestTrackerNode } from '../types/quest';
import { queryTrackerNodesRequest } from '../utils/requestHandler';
import { ModuleRenderer } from './ModuleRenderer';
import { QuestStatsScreen } from './QuestStatsScreen';

export const GameplayScreen : React.FC = () => {

  const pinnedQuestPath = useAppSelector(state => state.quests.pinnedQuestPath)
  const pinnedQuest = useAppSelector(state => state.quests.pinnedQuest)
  const route = useRoute<RouteProp<{ params: {
    trackerId: string
  }}, 'params'>>();

  const ref = useRef<FlatList>(null);

  const [loadedTrackerNodes, setLoadedTrackerNodes] = useState<QuestPath | undefined>()

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

  return (
    <View>
      {/* avatar image + name, button to quest settings(vote, remove quest) */}
      
      <FlatList 
        data={loadedTrackerNodes?.trackerNodes || []} 
        renderItem={
          ({ item }) => <ModuleRenderer module={item as QuestTrackerNode} />
        }
        ListFooterComponent={<QuestStatsScreen height={innerHeight} quest={loadedTrackerNodes?.quest} flatListRef={ref}/>}
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