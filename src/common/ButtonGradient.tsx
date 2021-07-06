import React from 'react'
import { GestureResponderEvent, StyleSheet, Text, TouchableNativeFeedback, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const ButtonGradient = ({label, onPress, style} : {label: string, onPress: ((event: GestureResponderEvent) => void), style?: ViewStyle}) => (
  <TouchableNativeFeedback useForeground={true} onPress={onPress}>
    <LinearGradient
      colors={['#1D79AC', '#40A9B8']}
      style={[styleButton.gradient, style]}
    >
      <Text style={styleButton.gradientText}>
        {label}
      </Text>
    </LinearGradient>
  </TouchableNativeFeedback>
);

const styleButton = StyleSheet.create({
  gradient: {
    padding: 8,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'transparent',
    elevation: 5
  },
  gradientText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})