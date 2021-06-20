import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import { GameplayScreen } from './GameplayScreen';

const Stack = createStackNavigator();

export const GameplayNavigator = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name='GameplayScreen' component={GameplayScreen}/>
      <Stack.Screen name='QuestSettings' component={Dummy}/>
    </Stack.Navigator>
  );
}

const Dummy = () => (
  <View></View>
)

