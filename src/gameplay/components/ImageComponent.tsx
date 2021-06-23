import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';

import { ImageComponentResponse } from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';
import { getImageAddress } from '../../utils/requestHandler';
import { Colors, Containers } from '../../styles';

export const ImageComponent: React.FC<SingleComponentProps<ImageComponentResponse>> = ({ data }) => {

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{uri: getImageAddress(data.imageId, '')}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '70%',
    backgroundColor: Colors.primary,
    ...Containers.rounded,
    padding: 20,
    marginVertical: 10,
    borderTopLeftRadius: 3,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
    borderRadius: 20,
  },
});
