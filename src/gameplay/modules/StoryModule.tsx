import React from 'react';
import { Text } from 'react-native';
import { GameplayStoryModule } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';

export const StoryModule: React.FC<ModuleRendererProps<GameplayStoryModule>> = ({ module }) => {

  return (
    <Text>StoryModule: {module.module.id}</Text>
  )
}
