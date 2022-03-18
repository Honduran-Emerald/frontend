import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ChatHeaderTitleProps {
  userImgSource: string,
  userName: string,
  questTitle?: string,
  noProfileLink?: boolean,
  userId?: string
}

export const ChatHeaderTitle: React.FC<ChatHeaderTitleProps> = ({ userImgSource, userName, questTitle, noProfileLink, userId }) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity 
        style={styles.header} 
        {...(!noProfileLink && userId ? {onPress: () => {navigation.navigate('UserProfile', {screen: 'Profile', params:{userId: userId}})}} : {disabled: true})}
    >
      <>
        <Image source={{uri: userImgSource}} style={styles.image}/>
        <View>
          <Text style={styles.name}>{userName}</Text>
          {questTitle &&
            <Text>{questTitle}</Text>
          }
        </View>
      </>
    </TouchableOpacity>
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
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  }
})