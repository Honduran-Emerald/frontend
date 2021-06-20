import React from 'react';
import { Text, View } from 'react-native';
import { Containers } from '../styles';


export const Chip = ({value, caption} : {value: string, caption: string}) => (
  <View style={[Containers.center, {width: '80%'}]}>
    <Text style={{fontSize: 25, fontWeight: 'bold'}}>{value}</Text>
    <Text style={{lineHeight: 15}}>{caption}</Text>
  </View>
)