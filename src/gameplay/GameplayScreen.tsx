import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native';

import { useAppSelector } from '../redux/hooks';
import { PrototypeModule } from '../types/quest';
import { queryTrackerNodesRequest } from '../utils/requestHandler';
import { ModuleRenderer } from './ModuleRenderer';

export const GameplayScreen : React.FC = () => {

  const pinnedQuestPath = useAppSelector(state => state.quests.pinnedQuestPath)
  const pinnedQuest = useAppSelector(state => state.quests.pinnedQuest)
  const route = useRoute<RouteProp<{ params: {
    trackerId: string
  }}, 'params'>>();

  const [loadedTrackerNodes, setLoadedTrackerNodes] = useState<{
    module: PrototypeModule,
    memento: any
  }[]>([])

  useEffect(() => {
    queryTrackerNodesRequest(route.params.trackerId)
      .then(res => res.json())
      .then(res => setLoadedTrackerNodes(res.trackerNodes))
  }, [])

  return (
    <View>
      {/* avatar image + name, button to quest settings(vote, remove quest) */}
      <FlatList
        data={pinnedQuest?.trackerId === route.params.trackerId ? pinnedQuestPath?.trackerNodes.reverse() : loadedTrackerNodes.reverse()}
        renderItem={
          ({ item, index }) =>
            <ModuleRenderer module={item} index={index} />
        }
        style={{
          width: '100%',
        }}
        contentContainerStyle={{
          minHeight: '100%',
          width: '100%',
          paddingHorizontal: 10,
          paddingTop: 50
        }}

        keyExtractor={item => item.module.id.toString()}
        inverted
        />

    </View>
  )
}
