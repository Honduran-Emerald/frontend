import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash'
import { ChatMessage } from '../../types/general';

interface ChatPreview {
  userId: string,
  username: string,
  userImageId: string | null,
  lastReceived: Date,
  newestMessage: Date,
  lastMessageText: string,
}

interface ChatState {
  FCNtoken: string | undefined
  chatsPreviewList: ChatPreview[] | undefined,
  loadedChats: [string, ChatMessage[]][]
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

    loadPersonalChat: (state, action: PayloadAction<[string, ChatMessage[]]>) => {
      state.loadedChats = state.loadedChats.filter(chat => chat[0] !== action.payload[0])
      state.loadedChats.push([action.payload[0], action.payload[1]])
    },
    appendPersonalChat: (state, action: PayloadAction<[string, ChatMessage]>) => {
      state.loadedChats.find(chat => chat[0] === action.payload[0])?.[1].push(action.payload[1])
    }
  }
})

export const { setToken, unsetToken, loadChatPreview, updateChatPreview, loadPersonalChat, appendPersonalChat } = chatSlice.actions

export default chatSlice.reducer
