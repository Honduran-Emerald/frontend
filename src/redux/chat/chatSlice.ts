import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash'
import { IMessage } from 'react-native-gifted-chat';
import { ChatMessage, ChatMessageNotif } from '../../types/general';
import { getImageAddress } from '../../utils/imageHandler';

export interface ChatPreview {
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
      state.loadedChats = state.loadedChats.filter(chat => chat.targetId !== action.payload.otherId)
      state.loadedChats.push({
        targetId: action.payload.otherId,
        messages: action.payload.messages
      })
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
      state.loadedChats = state.loadedChats.filter(chat => chat.targetId !== action.payload.other.id)
      state.loadedChats.push({
        targetId: action.payload.other.id,
        messages: action.payload.messages.map(
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
          })) || []
      })
        const previewObject = state.chatsPreviewList?.find(cp => cp.userId === action.payload.other.id)
        if (previewObject) {
          previewObject.lastMessageText = action.payload.messages.length>0 ? action.payload.messages[0].text : ''
          previewObject.newestMessage = action.payload.messages.length>0 ? action.payload.messages[0].creationTime.toString() : (new Date).toString()
          state.chatsPreviewList = _.orderBy(state.chatsPreviewList, 'newestMessage', 'desc')
        }
    },
    appendPersonalChat: (state, action: PayloadAction<[string, IMessage[]]>) => {
      
      state.loadedChats.find(chat => chat.targetId === action.payload[0])?.messages.unshift(...action.payload[1])
      const previewObject = state.chatsPreviewList?.find(cp => cp.userId === action.payload[0])
      if (previewObject) {
        previewObject.lastMessageText = action.payload[1][0].text
        previewObject.newestMessage = action.payload[1][0].createdAt.toString()
        state.chatsPreviewList = _.orderBy(state.chatsPreviewList, 'newestMessage', 'desc')
      }
    },
    getMessage: (state, action: PayloadAction<ChatMessageNotif>) => {
      let preview: ChatPreview | undefined = state.chatsPreviewList?.find(chat => chat.userId === action.payload.Message.Sender)
      if (!preview) {
        preview = {
          lastMessageText: action.payload.Message.Text,
          lastReceived: action.payload.Message.CreationTime.toString(),
          newestMessage: action.payload.Message.CreationTime.toString(),
          userId: action.payload.Message.Sender,
          userImageId: action.payload.UserImageId,
          username: action.payload.Username
        }
        
        state.chatsPreviewList?.unshift(preview)
      } else {
        preview.lastMessageText = action.payload.Message.Text;
        preview.lastReceived = action.payload.Message.CreationTime.toString();
        preview.newestMessage = action.payload.Message.CreationTime.toString();
        state.chatsPreviewList = state.chatsPreviewList?.filter(chat => chat.userId !== action.payload.Message.Sender)
        state.chatsPreviewList?.unshift(preview)
      }

      let dm = state.loadedChats.find(chat => chat.targetId === action.payload.Message.Sender)
      if (dm) {
        dm.messages.unshift({
          _id: dm.messages.length,
          createdAt: action.payload.Message.CreationTime,
          text: action.payload.Message.Text,
          user: {
            _id: 2,
            avatar: getImageAddress(action.payload.UserImageId, action.payload.Username),
            name: action.payload.Username
          }
        })
      }
    },
    setRead: (state, action: PayloadAction<string>) => {
      const preview = state.chatsPreviewList?.find(cp => cp.userId === action.payload) 
      if (preview) {
        preview.lastReceived = (new Date(Date.now())).toJSON()
      }
    }
  }

})

export const { setToken, unsetToken, loadChatPreview, updateChatPreview, loadPersonalChat, appendPersonalChat, loadFromApi, getMessage, setRead } = chatSlice.actions

export default chatSlice.reducer
