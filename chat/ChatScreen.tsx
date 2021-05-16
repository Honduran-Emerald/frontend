import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ChatOverview } from './overview/ChatOverview';
import { ChatPersonal } from './personal/ChatPersonal';

export const ChatScreen: React.FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={() => ({headerShown: false})}>
            <Stack.Screen name='ChatOverview' component={ChatOverview}/>
            <Stack.Screen name='ChatPersonal' component={ChatPersonal}/>
        </Stack.Navigator>
    )
}