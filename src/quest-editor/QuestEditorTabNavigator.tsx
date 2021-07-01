import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { QuestPropertiesScreen } from './QuestPropertiesScreen';
import { Colors } from '../styles';
import { ModuleGraphCaller } from './graph/ModuleGraphCaller';

type TabParams = {
  QuestCreation: {latitude: number, longitude: number},
  ModuleGraph: undefined,
  CreateModule: any
}
const Tab = createMaterialTopTabNavigator<TabParams>();
export const QuestEditorTabNavigator = () => {

  return (
    <Tab.Navigator
      style={{backgroundColor: Colors.background}}
      tabBarOptions={{indicatorStyle: {backgroundColor: Colors.primary}}}
    >
      <Tab.Screen name='QuestCreation' component={QuestPropertiesScreen} options={{tabBarLabel: 'Properties'}}/>
      <Tab.Screen name='ModuleGraph' component={ModuleGraphCaller} options={{tabBarLabel: 'Modules'}}/>
    </Tab.Navigator>
  );
};