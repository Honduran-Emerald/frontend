import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';
import { FlatList } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { ModuleRenderer } from './ModuleRenderer';

export const GameplayScreen : React.FC = () => {

  const pinnedQuestPath = useAppSelector(state => state.quests.pinnedQuestPath)

  return (
    <View>
      {/* avatar image + name, button to quest settings(vote, remove quest) */}
      <FlatList 
        data={pinnedQuestPath?.modules} 
        renderItem={
          ({ item }) => 
            <ModuleRenderer module={item} />
        }
        inverted/>
    </View>
  )
}