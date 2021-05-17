import React from 'react';
import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';


interface ChatSingleElementInterface {
  userName: string,
  userImgSource: ImageSourcePropType,
  lastMessage: string,
}

export const ChatSingleElement: React.FC<ChatSingleElementInterface> = ({ userName, userImgSource, lastMessage }) => {
  return (
    <View style={styles.singleChatContainer}>
      <Image 
        source={userImgSource}
        style={styles.pbImage} />
      <View style={styles.singleChatTextContainer}>
        <Text style={styles.bold}>
          {userName}
        </Text>
        <Text numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
    </View>
  )
}

const imageSize = 50;

const styles = StyleSheet.create({
  pbImage : {
    borderRadius: 100000, //This is a large number
    width: imageSize,
    height: imageSize,
    resizeMode: 'contain'
  },
  singleChatContainer: {
    borderBottomWidth: 1,
    borderColor: 'lightgray',

    width: Dimensions.get('window').width,
    padding: 10,
    flexDirection: 'row'
  },
  singleChatTextContainer: {
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: 'space-around',
    width: Dimensions.get('window').width - imageSize
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 15
  }
})