import React from 'react';
import { Text } from 'react-native';
import { ImageComponent as ImageComponentType} from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';

export const ImageComponent: React.FC<SingleComponentProps<ImageComponentType>> = ({ data }) => {

  return (
    <Text>ImageComponent: {data.imageReference}</Text>
  )
}