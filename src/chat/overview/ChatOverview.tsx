import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image, ImageSourcePropType, StatusBar } from 'react-native';
import image from '../pb.png';
import chrom from '../chrom.png';
import phisn from '../phi.jpg';
import { ChatSingleElement } from './ChatSingleElement';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationState } from '@react-navigation/routers';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';


const messages = [
  {
    name: 'Nico Kunz',
    message: "Hey, you. You're finally awake. You were trying to cross the border, right? Walked right into that Imperial ambush, same as us, and that thief over there. Lokir: Damn you Stormcloaks. Skyrim was fine until you came along",
    pb: image,
    messages: []
  },
  {
    name: 'HK',
    message: "Change your default web browser?",
    pb: chrom,
    messages: []
  },
  {
    name: 'Phisns Vogel',
    message: "Hilfe ich wurde gestohlen!",
    pb: phisn,
    messages: []
  },
]

const messagesLong = messages.concat(messages, messages, messages, messages, messages, messages, messages, messages)

export const ChatOverview: React.FC<{navigation: any}> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollable}>
       
        <View style={styles.chats}>
          {messagesLong.map((val, idx) => 
            <TouchableOpacity onPress={() => navigation.navigate('Chat', {
                                                                    screen: 'ChatPersonal',
                                                                    params: {
                                                                      userName: val.name,
                                                                      userImgSource: val.pb,
                                                                      messages: val.messages
                                                                    }})}
                              key={idx}>

              <ChatSingleElement 
                userName={val.name} 
                lastMessage={val.message} 
                userImgSource={val.pb} 
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
      backgroundColor: '#fff',
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