import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, Image, ImageSourcePropType, SafeAreaView, KeyboardAvoidingView, View, TextInput } from 'react-native';
import { Bubble, GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import { appendPersonalChat, loadFromApi, loadPersonalChat } from '../../redux/chat/chatSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Colors } from '../../styles';
import { primary, primaryLight, secondary } from '../../styles/colors';
import { getImageAddress } from '../../utils/imageHandler';
import { chatGetRequest, chatSendTextRequest } from '../../utils/requestHandler';

interface ChatPersonalInterface {
    route: any,
    navigator: any,
}

const selfUserId = 1;
const otherUserId = 2;

export const ChatPersonal: React.FC = () => {

    const route = useRoute<RouteProp<{ params: {
        userName: string,
        userImgSource: string,
        userTargetId: string,
    }}, 'params'>>();

    const dispatch = useAppDispatch();
    const chats = useAppSelector(state => state.chat.loadedChats)
    const user = useAppSelector(state => state.authentication.user)

    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {

        chatGetRequest(route.params.userTargetId, 0)
            .then(res => res.json())
            .then(res => dispatch(loadFromApi({
                other: {
                    id: route.params.userTargetId,
                    avatar: route.params.userImgSource,
                    name: route.params.userName
                },
                self: {
                    avatar: !user ? 'None' :
                            getImageAddress(user.image, route.params.userName),
                    name: user?.userName || 'None'
                },                
                messages: res.messages
            })));

    }, [])

    useEffect(() => {
        setMessages(chats.find(chat => chat.targetId === route.params.userTargetId)?.messages || [])
    }, [chats])

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))

        newMessages.forEach(message => chatSendTextRequest(route.params.userTargetId, message.text))
        
        //@ts-ignore
        dispatch(appendPersonalChat([route.params.userTargetId, newMessages.map(m => ({...m, createdAt: m.createdAt.toString()}))]))

    }, [])

    return (
        <KeyboardAvoidingView style={{flex: 1}}>

            
            <GiftedChat 
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: selfUserId,
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
        </KeyboardAvoidingView>
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