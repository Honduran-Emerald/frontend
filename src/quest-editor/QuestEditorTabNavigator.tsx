import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { QuestPropertiesScreen } from './QuestPropertiesScreen';
import { Colors } from '../styles';
import { ModuleGraphCaller } from './graph/ModuleGraphCaller';
import { AdvancedSettings } from './AdvancedSettings';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { useAppSelector } from '../redux/hooks';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { unloadQuest } from '../redux/editor/editorSlice';

type TabParams = {
  QuestCreation: {latitude: number, longitude: number},
  ModuleGraph: undefined,
  CreateModule: any,
  AdvancedOptions: any,
}
const Tab = createMaterialTopTabNavigator<TabParams>();
export const QuestEditorTabNavigator = () => {

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const unsavedChanges = useAppSelector(state => state.editor.unsavedChanges)

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const unsavedChangesRef = useRef<boolean>(false)

  useEffect(() => {
    unsavedChangesRef.current = unsavedChanges
  }, [unsavedChanges])

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.source !== undefined || !unsavedChangesRef.current) return;
      e.preventDefault();
      setShowDialog(true);
    })
  }, [])

  return (
    <>
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Leave Quest Editor?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Everything not saved will be lost</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color={Colors.primary} onPress={() => setShowDialog(false)}>Stay</Button>
            <Button color={Colors.primary} onPress={() => {setShowDialog(false); dispatch(unloadQuest()); navigation.goBack()}}>Drop Changes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    <Tab.Navigator
      style={{backgroundColor: Colors.background}}
      tabBarOptions={{indicatorStyle: {backgroundColor: Colors.primary}}}
    >
      <Tab.Screen name='QuestCreation' component={QuestPropertiesScreen} options={{tabBarLabel: 'Properties'}}/>
      <Tab.Screen name='ModuleGraph' component={ModuleGraphCaller} options={{tabBarLabel: 'Modules'}}/>
      <Tab.Screen name='AdvancedOptions' component={AdvancedSettings} options={{tabBarLabel: 'Advanced'}}/>
    </Tab.Navigator>
    </>
  );
};