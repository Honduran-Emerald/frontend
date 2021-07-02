import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image, ImageSourcePropType, StatusBar } from 'react-native';
import { ChatSingleElement } from './ChatSingleElement';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationState } from '@react-navigation/routers';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useAppSelector } from '../../redux/hooks';
import { getImageAddress } from '../../utils/requestHandler';
import { Colors } from '../../styles';

export const ChatOverview: React.FC<{navigation: any}> = ({ navigation }) => {

  const chatsPreviewList = useAppSelector(state => state.chat.chatsPreviewList)

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollable}>
      {/* userName: string,
        userImgSource: string,
        userTargetId: string, */}
        <View style={styles.chats}>
          {chatsPreviewList && chatsPreviewList.map((val, idx) => 
            <TouchableOpacity onPress={() => navigation.navigate('ChatPersonal', {
                                                                      userName: val.username,
                                                                      userImgSource: getImageAddress(val.userImageId, val.username),
                                                                      userTargetId: val.userId
                                                                    })}
                              key={idx}>

              <ChatSingleElement 
                userName={val.username} 
                lastMessage={val.lastMessageText} 
                userImgSource={getImageAddress(val.userImageId, val.username)} 
                />

            </TouchableOpacity>
            )}
        </View>
          
      </ScrollView>
    </View>
  )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      alignItems: 'center',
      //paddingTop: StatusBar.currentHeight // not needed if navigation header is shown
    },
    scrollable: {
      
    },
    chats: {
      borderTopWidth: 1,
      borderColor: 'lightgray',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },
    locationButton: {
      position: 'absolute',
      right: 10,
      bottom: 20,
      backgroundColor: '#FFF',
      borderRadius: 100,
      padding: 12,
      elevation: 3
    }
  });