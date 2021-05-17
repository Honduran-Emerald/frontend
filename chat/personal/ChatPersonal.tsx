import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

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
        <View style={styles.container}>
            <Text>
                {route.params.userName}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight
    }
}) 