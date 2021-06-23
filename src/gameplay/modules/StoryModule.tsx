import React from 'react';
import { Text } from 'react-native';
import { PrototypeStoryModuleResponse } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';

export const StoryModule: React.FC<ModuleRendererProps<PrototypeStoryModuleResponse>> = ({ module }) => {

  return (
    <Text>StoryModule: {module.module.id}</Text>
  )
}
