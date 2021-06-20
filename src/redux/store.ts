import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './authentication/authenticationSlice';
import questsReducer from './quests/questsSlice';
import editorReducer from './editor/editorSlice';
import chatReducer from './chat/chatSlice';
import locationReducer from './location/locationSlice';

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        quests: questsReducer,
        editor: editorReducer,
        chat: chatReducer,
        location: locationReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
