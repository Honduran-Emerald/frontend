import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AuthNavigator from './authentication/AuthNavigator';
import MainAppNavigator from './MainAppNavigator';

const Stack = createStackNavigator();

//TODO check for saved token
async function getToken() {
  let result = await SecureStore.getItemAsync('UserToken');
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={() => ({headerShown: false})}>
        <Stack.Screen name='Authentication' component={AuthNavigator}/>
        <Stack.Screen name='MainApp' component={MainAppNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



