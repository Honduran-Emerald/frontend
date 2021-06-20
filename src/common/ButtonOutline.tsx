import React from 'react'
import { GestureResponderEvent, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { Colors } from '../styles';

export const ButtonOutline = ({label, onPress} : {label: string, onPress: ((event: GestureResponderEvent) => void)}) => (
  <TouchableNativeFeedback style={{elevation: 2}} onPress={onPress}>
    <View style={style.outline}>
      <Text style={style.textOutline}>
        {label}
      </Text>
    </View>
  </TouchableNativeFeedback>
);

const style = StyleSheet.create({
  outline: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    color: Colors.primary,
    borderWidth: 1.5,
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 5,
    elevation: 5
  },
  textOutline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
})