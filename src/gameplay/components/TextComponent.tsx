import React from 'react';
import { Text } from 'react-native';
import { TextComponent as TextComponentType } from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';
import { styleGameplay } from '../styleGameplay';

export const TextComponent: React.FC<SingleComponentProps<TextComponentType>> = ({ data }) => {

  return (
    <Text style={styleGameplay.bubble}>{data.text}</Text>
  )
}