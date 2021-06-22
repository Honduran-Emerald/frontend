import React from 'react';
import { Text } from 'react-native';
import { PrototypeStoryModule } from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';
import { ModuleRendererProps } from '../ModuleRenderer';

export const StoryModule: React.FC<ModuleRendererProps<PrototypeStoryModule>> = ({ module }) => {

  return (
    <Text>StoryModule: {module.module.id}</Text>
  )
}