import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Module } from '../../types/quest';

interface EditorState {
    meta: number, //temp
    modules: Module[]
}

const initialState: EditorState = {
    meta: 0, //temp
    modules: []
}

export const questsSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
    setLocalQuests: (state, action: PayloadAction<[string, number, number][]>) => {
            //state.localQuests = action.payload
        }
    }
})

export const { setLocalQuests } = questsSlice.actions

export default questsSlice.reducer
