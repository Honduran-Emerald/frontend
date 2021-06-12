import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/general';

interface AuthenticationState {
    token: string | undefined
    user: User | undefined
    tokenInvalid: boolean
}

const initialState: AuthenticationState = {
    token: undefined,
    user: undefined,
    tokenInvalid: false
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
            state.tokenInvalid = false
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        unsetToken: (state) => {
            if(state.token) state.tokenInvalid = true
            state.token = undefined
            state.user = undefined
        },
        logout: (state) => {
            state.token = undefined
            state.user = undefined
        },
    }
})

export const { setToken, setUser, unsetToken, logout} = authenticationSlice.actions

export default authenticationSlice.reducer
