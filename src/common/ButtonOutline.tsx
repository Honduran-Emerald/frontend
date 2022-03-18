import React from 'react'
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { Colors } from '../styles';

export const ButtonOutline = ({label, onPress, loading} : {label: string, onPress: ((event: GestureResponderEvent) => void), loading?: boolean}) => (
  <TouchableNativeFeedback style={{elevation: 2}} onPress={onPress}>
    <View style={styleButton.outline}>
      {
        loading ? 
          <ActivityIndicator size={24} color={Colors.primary} animating/> : 
          <Text style={styleButton.textOutline}>
            {label}
          </Text>
      }
    </View>
  </TouchableNativeFeedback>
);

const styleButton = StyleSheet.create({
  outline: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    color: Colors.primary,
    borderWidth: 1.5,
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    elevation: 5
  },
  textOutline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
})