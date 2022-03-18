import React from 'react';
import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { ChatPreview } from '../../redux/chat/chatSlice';
import { Colors } from '../../styles';
import { getImageAddress } from '../../utils/imageHandler';


interface ChatSingleElementInterface {
  preview: ChatPreview,
}

export const ChatSingleElement: React.FC<ChatSingleElementInterface> = ({ preview }) => {
  return (
    <View style={styles.singleChatContainer}>
      <Image 
        source={{
          uri: getImageAddress(preview.userImageId, preview.username) 
        }}
        style={styles.pbImage} />
      <View style={styles.singleChatTextContainer}>
        <Text style={styles.bold} numberOfLines={1}>
          {preview.username}
        </Text>
        <Text numberOfLines={1}>
          {preview.lastMessageText}
        </Text>
      </View>
      <View style={{width: 30, height: 50, justifyContent: 'center'}}>

        <Badge 
          visible={Date.parse(preview.lastReceived) <= Date.parse(preview.newestMessage)} 
          style={styles.badge} 
          theme={{colors: {notification: Colors.primaryLight}}} 
          size={17} />
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
    resizeMode: 'cover'
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
    maxWidth: Dimensions.get('window').width - imageSize - 60,
    flexGrow: 1
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 15
  },
  badge: {
    alignSelf: 'center',
    justifyContent: 'center',
    
    borderWidth: 2,
    borderColor: Colors.background,
  },
})