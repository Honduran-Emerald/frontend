import React from 'react';
import { Text } from 'react-native';
import { PrototypeChoiceModule } from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';
import { ModuleRendererProps } from '../ModuleRenderer';

export const ChoiceModule: React.FC<ModuleRendererProps<PrototypeChoiceModule>> = () => {

  return (
    <Text>ChoiceModule</Text>
  )
}