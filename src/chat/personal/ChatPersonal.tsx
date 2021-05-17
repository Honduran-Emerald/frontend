import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ImageSourcePropType } from 'react-native';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { primary, primaryLight, secondary } from '../../styles/colors';

interface ChatPersonalInterface {
    route: any,
    navigator: any,
}

export const ChatPersonal: React.FC = () => {

    const route = useRoute<RouteProp<{ params: {
        userName: string,
        userImgSource: ImageSourcePropType,
        messages: [{isSender: boolean, content: string}]
    }}, 'params'>>();
    const navigation = useNavigation();

    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'React Native',
                  avatar: route.params.userImgSource as any,
                },
              }
        ]);
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <GiftedChat 
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            renderBubble={props => (<Bubble
                {...props/* DO NOT EDIT THIS
                // line below literally does not work otherwise and
                // I don't know how to ts-ignore in JSX. It works.
                // @ts-ignore */}
                textStyle={{
                    left: {
                        color: '#FFF'
                    }
                }}
                timeTextStyle={{
                    left: {
                        color: 'lightgray'
                    }
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: primary
                    },
                    right: {
                        backgroundColor: secondary
                    }
                }}
                />)}
        
        />
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