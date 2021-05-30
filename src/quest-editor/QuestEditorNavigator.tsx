import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ModuleGraph } from './ModuleGraph';
import { ModuleGraphCaller } from './ModuleGraphCaller';
import { QuestCreationScreen } from './QuestCreationScreen';

const Stack = createStackNavigator();

export const QuestEditorNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={(route) => ({
        headerShown: true
      })}
    >
      <Stack.Screen name='QuestCreation' component={QuestCreationScreen}/>
      <Stack.Screen name='ModuleGraph' component={ModuleGraphCaller}/>
    </Stack.Navigator>
  );
};