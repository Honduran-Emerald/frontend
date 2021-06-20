import React from 'react';
import { Image, ImageSourcePropType, StatusBar, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { getImageAddress } from '../../utils/requestHandler';

interface ChatHeaderTitleProps {
    userImgSource: string,
    userName: string
}

export const ChatHeaderTitle: React.FC<ChatHeaderTitleProps> = ({ userImgSource, userName }) => {

    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <Image source={{
                uri: getImageAddress(userImgSource, userName)
            }} style={styles.image}/>
            <Text>{userName}</Text>
        </View>
    )
}

const iconSize = 40;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: iconSize,
        height: iconSize,
        borderRadius: 10000,
        marginHorizontal: 10
    }
})