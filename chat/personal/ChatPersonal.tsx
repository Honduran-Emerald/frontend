import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React from 'react';
import { Text, View } from 'react-native';

interface ChatPersonalInterface {
    route: any,
    navigator: any,
}

export const ChatPersonal: React.FC = () => {

    const route = useRoute<RouteProp<{ params: {
        userName: string,
        userImgSource: string,
        messages: [{isSender: boolean, content: string}]
    }}, 'params'>>();
    const navigation = useNavigation();

    return (
        <View>
            {route.params.userName}
        </View>
    )
}