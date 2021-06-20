import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from './MapScreen';
import { QuestEditorTabNavigator } from '../quest-editor/QuestEditorTabNavigator';
import QuestDetailScreen from '../common/QuestDetailScreen';
import { Colors } from '../styles'
import { QuestCreatorWrapper } from '../quest-editor/QuestCreatorWrapper';

type StackParams = {
  QuestCreationScreen: {latitude: number, longitude: number},
  MapScreen: undefined,
  QuestDetail: undefined,
}

const Stack = createStackNavigator<StackParams>();

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
