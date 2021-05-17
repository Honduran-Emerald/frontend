import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from './MapScreen';

const Stack = createStackNavigator();

export const MapNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={(route) => ({
        headerShown: false
      })}
    >
      <Stack.Screen name='MapScreen' component={MapScreen}/>
    </Stack.Navigator>
  );
};