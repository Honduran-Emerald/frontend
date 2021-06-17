import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash'

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
  chatsList: ChatPreview[] | undefined
}

const initialState: ChatState = {
  FCNtoken: undefined,
  chatsList: undefined,
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
      state.chatsList = _.sortBy(action.payload, (o => o.newestMessage))  
    },
    updateChatPreview: (state, action: PayloadAction<ChatPreview>) => {
      state.chatsList = state.chatsList?.filter(cp => cp.userId !== action.payload.userId)
      state.chatsList?.unshift(action.payload)
    }
  }
})

export const { setToken, unsetToken, loadChatPreview } = chatSlice.actions

export default chatSlice.reducer
