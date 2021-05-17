import React from 'react'
import { Image, ImageSourcePropType, StatusBar, StyleSheet, Text, View } from 'react-native'

interface ChatHeaderTitleProps {
    userImgSource: ImageSourcePropType,
    userName: string
}

export const ChatHeaderTitle: React.FC<ChatHeaderTitleProps> = ({ userImgSource, userName }) => (
    <View style={styles.header}>
        <Image source={userImgSource} style={styles.image}/>
        <Text>{userName}</Text>
    </View>
    
)

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight
        
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 10000
    }
})