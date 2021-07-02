import React from 'react';
import { Text, View } from 'react-native';
import { GameplayTextComponent } from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';
import { styleGameplay } from '../styleGameplay';

export const TextComponent: React.FC<SingleComponentProps<GameplayTextComponent>> = ({ data }) => {

  return (
    <View>
      {
        data.text !== '' &&
        <Text style={[styleGameplay.bubble, styleGameplay.left]}>{data.text}</Text>
      }
    </View>
  )
}
