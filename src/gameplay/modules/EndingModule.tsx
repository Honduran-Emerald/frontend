import React from 'react';
import { Text } from 'react-native';
import { PrototypeEndingModuleResponse } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';
import { styleGameplay } from '../styleGameplay';

export const EndingModule: React.FC<ModuleRendererProps<PrototypeEndingModuleResponse>> = ({ module }) => {

  return (
    <Text style={[styleGameplay.bubble, {alignSelf: 'flex-end', width: '50%', textAlign: 'right'}]}>EndingModule: {module.module.id}</Text>
  )
}
