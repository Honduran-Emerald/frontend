import React from 'react';
import { Text, View } from 'react-native';
import { TextComponent as TextComponentType } from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';
import { styleGameplay } from '../styleGameplay';

export const TextComponent: React.FC<SingleComponentProps<TextComponentType>> = ({ data }) => {

  return (
    <View>
      {
        data.text !== '' &&
        <Text style={[styleGameplay.bubble, styleGameplay.left]}>{data.text}</Text>
      }
    </View>
  )
}
