import React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';
import { FlatList } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { ModuleRenderer } from './ModuleRenderer';

export const GameplayScreen : React.FC = () => {

  const pinnedQuestPath = useAppSelector(state => state.quests.pinnedQuestPath)

  useEffect(() => {
    console.log(pinnedQuestPath)
  })

  return (
    <View>
      {/* avatar image + name, button to quest settings(vote, remove quest) */}
      <FlatList 
        data={pinnedQuestPath?.trackerNodes.reverse()} 
        renderItem={
          ({ item }) => 
            <ModuleRenderer module={item} />
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
        
        //@ts-ignore
        keyExtractor={item => item.module.moduleId.toString()}
        inverted
        />
        
    </View>
  )
}