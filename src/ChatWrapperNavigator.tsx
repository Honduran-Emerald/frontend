import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ChatHeaderTitle } from './chat/personal/ChatHeaderTitle';
import { ChatPersonal } from './chat/personal/ChatPersonal';
import MainAppNavigator from './MainAppNavigator';
import LocationPicker from './quest-editor/LocationPicker';
import { QuestCreatorWrapper } from './quest-editor/QuestCreatorWrapper';
import { QuestEditorWrapper } from './quest-editor/QuestEditorWrapper';
import {StatusBar as StatusBar2} from "react-native";


export const ChatWrapperNavigator: React.FC = () => {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen component={MainAppNavigator} name='Main' 
        options={{
          headerShown: false
        }}/>
        
      <Stack.Screen component={ChatPersonal} name='ChatPersonal' 
        options={({ route }: {route: any}) => 
          ({
              title: route.params?.userName || 'Personal Chat',
              headerTitle: props => <ChatHeaderTitle {...props} userName={route.params.userName} userImgSource={route.params.userImgSource}/>,
              headerTitleContainerStyle: {left: 50}, headerStyle: {borderTopColor: "#f2f2f2", borderTopWidth: StatusBar2.currentHeight}
          })}/>

      <Stack.Screen name='QuestCreationScreen' component={QuestCreatorWrapper} 
        options={{
          headerShown: false
        }}/>

      <Stack.Screen name='QuestEditorScreen' component={QuestEditorWrapper} 
        options={{
          headerShown: false
        }}/>

      <Stack.Screen name='LocationPicker' component={LocationPicker} 
        options={{
          headerShown: false
        }}/>
      </Stack.Navigator>
  )
}
