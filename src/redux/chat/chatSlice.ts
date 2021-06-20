import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash'
import { IMessage } from 'react-native-gifted-chat';
import { ChatMessage } from '../../types/general';
import { getImageAddress } from '../../utils/requestHandler';

interface ChatPreview {
  userId: string,
  username: string,
  userImageId: string | null,
  lastReceived: string,
  newestMessage: string,
  lastMessageText: string,
}

interface ChatState {
  FCNtoken: string | undefined
  chatsPreviewList: ChatPreview[] | undefined,
  loadedChats: {
    targetId: string, 
    messages: IMessage[]
  }[]
}

const initialState: ChatState = {
  FCNtoken: undefined,
  chatsPreviewList: undefined,
  loadedChats: []
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.FCNtoken = action.payload
    },
    unsetToken: (state) => {
      state.FCNtoken = undefined
    },

    loadChatPreview: (state, action: PayloadAction<ChatPreview[]>) => {
      state.chatsPreviewList = action.payload 
    },
    updateChatPreview: (state, action: PayloadAction<ChatPreview>) => {
      state.chatsPreviewList = state.chatsPreviewList?.filter(cp => cp.userId !== action.payload.userId)
      state.chatsPreviewList?.unshift(action.payload)
    },

    loadPersonalChat: (state, action: PayloadAction<{otherId: string, messages: IMessage[]}>) => {
      state.loadedChats = state.loadedChats.filter(chat => chat[0] !== action.payload.otherId)
      state.loadedChats.push([action.payload.otherId, action.payload.messages])
      const previewObject = state.chatsPreviewList?.find(cp => cp.userId === action.payload.otherId)
      if (previewObject) {
        previewObject.lastMessageText = action.payload.messages[0].text
        previewObject.newestMessage = action.payload.messages[0].createdAt.toString()
        state.chatsPreviewList = _.orderBy(state.chatsPreviewList, 'newestMessage', 'desc')
      }
    },
    loadFromApi: (state, action: PayloadAction<{
      other: {
        avatar: string,
        name: string,
        id: string
      }, 
      self: {
        avatar: string,
        name: string,
      },
      messages: ChatMessage[]
    }>) => {
      state.loadedChats = state.loadedChats.filter(chat => chat[0] !== action.payload.other.id)
      state.loadedChats.push([action.payload.other.id, action.payload.messages.map(
        (message, idx) => ({
            _id: idx,
            text: message.text,
            //image: 'https://live.staticflickr.com/398/19809452730_bb17f07d2c_b.jpg', // Do this to add images
            createdAt: message.creationTime,
            user: (message.sender !== action.payload.other.id) ? {
                _id: 1,
                avatar: action.payload.self.avatar,
                name: action.payload.self.name
            } : {
                _id: 2,
                avatar: action.payload.other.avatar,
                name: action.payload.other.name
            }
        })) || []])
        const previewObject = state.chatsPreviewList?.find(cp => cp.userId === action.payload.other.id)
        if (previewObject) {
          previewObject.lastMessageText = action.payload.messages[0].text
          previewObject.newestMessage = action.payload.messages[0].creationTime.toString()
          state.chatsPreviewList = _.orderBy(state.chatsPreviewList, 'newestMessage', 'desc')
        }
    },
    appendPersonalChat: (state, action: PayloadAction<[string, IMessage[]]>) => {
      //@ts-ignore
      state.loadedChats.find(chat => chat[0] === action.payload[0])?.[1].unshift(...action.payload[1])
      const previewObject = state.chatsPreviewList?.find(cp => cp.userId === action.payload[0])
      if (previewObject) {
        previewObject.lastMessageText = action.payload[1][0].text
        previewObject.newestMessage = action.payload[1][0].createdAt.toString()
        state.chatsPreviewList = _.orderBy(state.chatsPreviewList, 'newestMessage', 'desc')
      }
    },
    getMessage: (state, action: PayloadAction<any>) => {
      let preview: ChatPreview | undefined = state.chatsPreviewList?.find(chat => chat.userId === action.payload.Sender)
      if (!preview) {
        preview = {
          lastMessageText: action.payload.Text,
          lastReceived: action.payload.CreationTime.toString(),
          newestMessage: action.payload.CreationTime.toString(),
          userId: action.payload.Sender,
          userImageId: null, // TODO: Add user image id here
          username: 'None' // TODO: Add username here
        }
        
        state.chatsPreviewList?.unshift(preview)
      } else {
        preview.lastMessageText = action.payload.Text;
        preview.lastReceived = action.payload.CreationTime.toString();
        preview.newestMessage = action.payload.CreationTime.toString();
        state.chatsPreviewList = state.chatsPreviewList?.filter(chat => chat.userId !== action.payload.Sender)
        state.chatsPreviewList?.unshift(preview)
      }

      let dm = state.loadedChats.find(chat => chat[0] === action.payload.Sender)
      if (dm) {
        dm[1].unshift({
          _id: dm[1].length,
          createdAt: action.payload.CreationTime,
          text: action.payload.Text,
          user: {
            _id: 2,
            avatar: undefined,
            name: 'None'
          }
        })
      }
    }
  }
})

export const { setToken, unsetToken, loadChatPreview, updateChatPreview, loadPersonalChat, appendPersonalChat, loadFromApi, getMessage } = chatSlice.actions

export default chatSlice.reducer
