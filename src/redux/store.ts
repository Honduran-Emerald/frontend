import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './authentication/authenticationSlice';
import questsReducer from './quests/questsSlice';

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        quests: questsReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
