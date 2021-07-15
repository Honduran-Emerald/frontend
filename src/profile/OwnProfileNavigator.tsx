import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from './ProfileScreen';
import QuestDetailScreen from '../common/QuestDetailScreen';
import {SettingsScreen} from "./SettingsScreen";
import { ProfileNavigator } from './ProfileNavigator';


const Stack = createStackNavigator();

export const OwnProfileNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='Profile' component={ProfileNavigator} />
    <Stack.Screen name='UserProfile' component={ProfileNavigator}/>
  </Stack.Navigator>
)
