import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

export const Divider = () => (
  <View style={style.divider} />
)

const style = StyleSheet.create({
  divider: {
    borderColor: '#000',
    borderRightWidth: 1.5,
    height: '80%',
  },
})