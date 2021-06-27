import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from './ProfileScreen';
import QuestDetailScreen from '../common/QuestDetailScreen';


const Stack = createStackNavigator();

export const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='Profile' component={ProfileScreen} />
    <Stack.Screen name='QuestDetail' component={QuestDetailScreen}/>
  </Stack.Navigator>
)
