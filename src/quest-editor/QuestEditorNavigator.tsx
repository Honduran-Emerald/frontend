import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ModuleGraph } from './ModuleGraph';

const Stack = createStackNavigator();

export const QuestEditorNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={(route) => ({
        headerShown: true
      })}
    >
      <Stack.Screen name='ModuleGraph' component={ModuleGraph}/>
    </Stack.Navigator>
  );
};