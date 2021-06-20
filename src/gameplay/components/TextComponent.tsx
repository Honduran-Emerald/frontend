import React from 'react';
import { Text } from 'react-native';
import { SingleComponentProps } from '../ComponentRenderer';
import { styleGameplay } from '../styleGameplay';

export const TextComponent: React.FC<SingleComponentProps> = () => {

  return (
    <Text style={styleGameplay.bubble}>TextComponent</Text>
  )
}