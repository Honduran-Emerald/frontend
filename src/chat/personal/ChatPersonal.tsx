import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, Image, ImageSourcePropType, SafeAreaView, KeyboardAvoidingView, View, TextInput } from 'react-native';
import { Bubble, GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import { loadPersonalChat } from '../../redux/chat/chatSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { primary, primaryLight, secondary } from '../../styles/colors';
import { chatGetRequest, getImageAddress } from '../../utils/requestHandler';

interface ChatPersonalInterface {
    route: any,
    navigator: any,
}

const selfUserId = 1;
const otherUserId = 2;

export const ChatPersonal: React.FC = () => {

    const route = useRoute<RouteProp<{ params: {params: {
        userName: string,
        userImgSource: string,
        userTargetId: string,
    }}}, 'params'>>();

    console.log('route', route.params.params)

    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const chats = useAppSelector(state => state.chat.loadedChats)
    const user = useAppSelector(state => state.authentication.user)

    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {

        chatGetRequest(route.params.params.userTargetId, 0)
            .then(res => res.json())
            .then(res => dispatch(loadPersonalChat([route.params.params.userTargetId, res.messages])));

    }, [])

    useEffect(() => {
        console.log(user?.image, route.params.params.userImgSource)
        setMessages(chats.find(chat => chat[0] === route.params.params.userTargetId)?.[1].map(
                (message, idx) => ({
                    _id: idx,
                    text: message.text,
                    //image: 'https://live.staticflickr.com/398/19809452730_bb17f07d2c_b.jpg', // Do this to add images
                    createdAt: message.creationTime,
                    user: (message.sender === user?.userId) ? {
                        _id: selfUserId,
                        avatar: getImageAddress(user.image),
                        name: user.userName
                    } : {
                        _id: otherUserId,
                        avatar: route.params.params.userImgSource,
                        name: route.params.params.userName
                    }
                })) || [])
    }, [chats, user])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <KeyboardAvoidingView style={{flex: 1}}>

            
            <GiftedChat 
                //bottomOffset={-200}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: selfUserId,
                }}
                /* minInputToolbarHeight={100} */
                /* renderInputToolbar={props => (
                
                    <KeyboardAvoidingView
                        contentContainerStyle={{
                            backgroundColor: '#0f0'
                        }}
                        behavior='padding'
                    >

                    
                    <View style={{
                        margin: 20,
                        height: 50
                    }}>
                        <TextInput style={{
                            height: '100%',
                        borderRadius: 100,
                        backgroundColor: '#f00'
                        
                    }}/>
                    </View>
                    <View style={{
                        margin: 20,
                        height: 200
                    }}>
                    </View>
                    </KeyboardAvoidingView>
                )} */
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