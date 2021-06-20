import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import { GameplayScreen } from './GameplayScreen';
import QuestlogScreen from './QuestlogScreen';

const Stack = createStackNavigator();

export const GameplayNavigator = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name='QuestlogScreen' component={QuestlogScreen} options={{headerShown: false}}/>
      <Stack.Screen name='GameplayScreen' component={GameplayScreen}/>
      <Stack.Screen name='QuestSettings' component={Dummy}/>
    </Stack.Navigator>
  );
}

const Dummy = () => (
  <View></View>
)

