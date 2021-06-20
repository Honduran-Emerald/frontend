import React from 'react'
import { GestureResponderEvent, StyleSheet, Text, TouchableNativeFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const ButtonGradient = ({label, onPress} : {label: string, onPress: ((event: GestureResponderEvent) => void)}) => (
  <TouchableNativeFeedback useForeground={true} onPress={onPress}>
    <LinearGradient
      colors={['#1D79AC', '#40A9B8']}
      style={style.gradient}
    >
      <Text style={style.gradientText}>
        {label}
      </Text>
    </LinearGradient>
  </TouchableNativeFeedback>
);

const style = StyleSheet.create({
  gradient: {
    padding: 8,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5
  },
  gradientText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})