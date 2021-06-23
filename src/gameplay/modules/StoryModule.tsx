import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native';
import { GameplayStoryModule } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';

export const StoryModule: React.FC<ModuleRendererProps<GameplayStoryModule>> = ({ module, onChoice }) => {

  return (
    <View>
      <Button title={'Story Continue'} onPress={() => {onChoice(0)}}/>
    </View>
    
    /* <Text>StoryModule: {module.module.id}</Text> */
  )
}
