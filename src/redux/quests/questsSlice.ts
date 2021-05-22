import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuestsState {
    localQuests: [string, number, number][]
}

const initialState: QuestsState = {
    localQuests: []
}

export const questsSlice = createSlice({
    name: 'quests',
    initialState,
    reducers: {
    setLocalQuests: (state, action: PayloadAction<[string, number, number][]>) => {
            state.localQuests = action.payload
        }
    }
})

export const { setLocalQuests } = questsSlice.actions

export default questsSlice.reducer
