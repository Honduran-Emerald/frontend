import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

export default function AuthNavigator() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={() => ({headerShown: false})}>
      <Stack.Screen name='Login' component={LoginScreen}/>
      <Stack.Screen name='Register' component={RegisterScreen}/>
      <Stack.Screen name='ForgotPW' component={ForgotPasswordScreen}/>
    </Stack.Navigator>
  )
}



