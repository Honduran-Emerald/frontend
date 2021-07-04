import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from './MapScreen';
import QuestDetailScreen from '../common/QuestDetailScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { ProfileNavigator } from '../profile/ProfileNavigator';

type StackParams = {
  QuestCreationScreen: {latitude: number, longitude: number},
  MapScreen: undefined,
  QuestDetail: undefined,
  UserProfile: {userId: string},
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
      <Stack.Screen name='UserProfile' component={ProfileNavigator}/>
    </Stack.Navigator>
  );
};
