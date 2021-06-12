import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from './ProfileScreen';


const Stack = createStackNavigator();

export const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='Profile' component={ProfileScreen} />
  </Stack.Navigator>
)