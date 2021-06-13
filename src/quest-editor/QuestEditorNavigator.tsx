import { createStackNavigator } from '@react-navigation/stack';
import I18n from 'i18n-js';
import React from 'react';
import { LogBox } from 'react-native';
import { CreateModuleScreen } from './createModule/CreateModuleScreen';
import { QuestEditorTabNavigator } from './QuestEditorTabNavigator';
import { editorTranslations } from './translations';
import { Colors } from '../styles';
import { EditModuleScreen } from './createModule/EditModuleScreen';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

const Stack = createStackNavigator();

export const QuestEditorNavigator = () => {

  I18n.translations = editorTranslations
  I18n.fallbacks = true

  return (
    <Stack.Navigator screenOptions={{headerShown: true, headerTintColor: 'white', headerStyle: {backgroundColor: Colors.primary}}}>
      <Stack.Screen name='QuestEditorTabNavigator' component={QuestEditorTabNavigator} options={{headerTitle: I18n.t('editQuest')}}/>
      <Stack.Screen name='CreateModule' component={CreateModuleScreen} options={{headerTitle: I18n.t('createModuleTitle')}} />
      <Stack.Screen name='EditModule' component={EditModuleScreen} options={{headerTitle: 'Edit Quest'}} />
    </Stack.Navigator>
  )
}