import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import { GameplayScreen } from './GameplayScreen';
import QuestlogScreen from './QuestlogScreen';
import { ChatHeaderTitle } from '../chat/personal/ChatHeaderTitle';
import { getImageAddress } from '../utils/imageHandler';

const Stack = createStackNavigator();

export const GameplayNavigator = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name='QuestlogScreen' component={QuestlogScreen} options={{headerShown: false}}/>
      <Stack.Screen name='GameplayScreen' component={GameplayScreen} options={({ route }: {route: any}) =>
        ({
          headerTitle: props => <ChatHeaderTitle {...props} userName={route.params.tracker.agentProfileName !== '' ? route.params.tracker.agentProfileName : route.params.tracker.author}
                                                 userImgSource={getImageAddress(route.params.tracker.agentProfileImageId, route.params.tracker.agentProfileName)}
                                                 questTitle={route.params.tracker.questName}/>,
          headerTitleContainerStyle: {left: 50}
        })}/>
      <Stack.Screen name='QuestSettings' component={Dummy}/>
    </Stack.Navigator>
  );
}

const Dummy = () => (
  <View></View>
)

