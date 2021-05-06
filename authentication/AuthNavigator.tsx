import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';

export default function AuthNavigator() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={() => ({headerShown: false})}>
      <Stack.Screen name='Login' component={LoginScreen}/>
    </Stack.Navigator>
  )
}



