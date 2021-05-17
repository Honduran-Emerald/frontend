import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ChatOverview } from './overview/ChatOverview';
import { ChatHeaderTitle } from './personal/ChatHeaderTitle';
import { ChatPersonal } from './personal/ChatPersonal';

export const ChatNavigator: React.FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name='ChatOverview' component={ChatOverview}/>
            <Stack.Screen 
                name='ChatPersonal' 
                component={ChatPersonal}
                options={({ route }: {route: any}) => 
                ({
                    title: route.params?.userName || 'Personal Chat',
                    header: props => <ChatHeaderTitle {...props} userName={route.params.userName} userImgSource={route.params.userImgSource}/>

                    })}/>
        </Stack.Navigator>
    )
}