import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { ModuleGraphCaller } from './ModuleGraphCaller';
import { QuestCreationScreen } from './QuestCreationScreen';
import { Colors } from '../styles';

type TabParams = {
  QuestCreation: {latitude: number, longitude: number},
  ModuleGraph: undefined,
}
const Tab = createMaterialTopTabNavigator<TabParams>();
export const QuestEditorNavigator = () => {
  return (
    <Tab.Navigator
      style={{backgroundColor: Colors.background}}
      tabBarOptions={{indicatorStyle: {backgroundColor: Colors.primary}}}
    >
      <Tab.Screen name='QuestCreation' component={QuestCreationScreen} options={{tabBarLabel: 'Properties'}}/>
      <Tab.Screen name='ModuleGraph' component={ModuleGraphCaller} options={{tabBarLabel: 'Modules'}}/>
    </Tab.Navigator>
  );
};