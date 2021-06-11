import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/general';

interface AuthenticationState {
    token: string | undefined
    user: User | undefined
}

const initialState: AuthenticationState = {
    token: undefined,
    user: undefined
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        unsetToken: (state) => {
            state.token = undefined
            state.user = undefined
        }
    }
})

export const { setToken, setUser, unsetToken } = authenticationSlice.actions

export default authenticationSlice.reducer
