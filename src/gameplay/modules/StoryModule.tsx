import React from 'react';
import { Text } from 'react-native';
import { SingleComponentProps } from '../ComponentRenderer';
import { ModuleRendererProps } from '../ModuleRenderer';

export const StoryModule: React.FC<ModuleRendererProps> = () => {

  return (
    <Text>StoryModule</Text>
  )
}