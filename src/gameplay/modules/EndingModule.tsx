import React from 'react';
import { Text } from 'react-native';
import { SingleComponentProps } from '../ComponentRenderer';
import { ModuleRendererProps } from '../ModuleRenderer';
import { styleGameplay } from '../styleGameplay';

export const EndingModule: React.FC<ModuleRendererProps> = () => {

  return (
    <Text style={[styleGameplay.bubble, {alignSelf: 'flex-end', width: '50%', textAlign: 'right'}]}>EndingModule</Text>
  )
}