import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthenticationState {
    token: string | undefined
}

const initialState: AuthenticationState = {
    token: undefined
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        unsetToken: (state) => {
            state.token = undefined
        }
    }
})

export const { setToken, unsetToken } = authenticationSlice.actions

export default authenticationSlice.reducer
