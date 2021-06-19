import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { ChatOverview } from './overview/ChatOverview';
import { ChatHeaderTitle } from './personal/ChatHeaderTitle';
import { ChatPersonal } from './personal/ChatPersonal';

export const ChatNavigator: React.FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='ChatOverview' 
                component={ChatOverview}
                options={{
                    title: 'Chat',
                    headerTitle: 'Chat'
                }}/>
            {/* <Stack.Screen 
                name='ChatPersonal' 
                component={ChatPersonal}
                options={({ route }: {route: any}) => 
                ({
                    title: route.params?.userName || 'Personal Chat',
                    headerTitle: props => <ChatHeaderTitle {...props} userName={route.params.userName} userImgSource={route.params.userImgSource}/>,
                    headerTitleContainerStyle: {left: 50}
                })}/> */}
        </Stack.Navigator>
    )
}