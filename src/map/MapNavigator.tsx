import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from './MapScreen';
import QuestDetailScreen from '../common/QuestDetailScreen';

const Stack = createStackNavigator();

export const MapNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={(route) => ({
        headerShown: false
      })}
    >
      <Stack.Screen name='MapScreen' component={MapScreen}/>
      <Stack.Screen name='QuestDetail' component={QuestDetailScreen}/>
    </Stack.Navigator>
  );
};
