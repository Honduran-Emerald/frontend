import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from './ProfileScreen';
import QuestDetailScreen from '../common/QuestDetailScreen';
import {SettingsScreen} from "./SettingsScreen";


const Stack = createStackNavigator();

export const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='Profile' component={ProfileScreen} />
    <Stack.Screen name='QuestDetail' component={QuestDetailScreen}/>
    <Stack.Screen name='Settings' component={SettingsScreen} options={{headerShown: true}}/>
  </Stack.Navigator>
)
