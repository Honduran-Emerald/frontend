import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestHeader, PrototypeModule, QuestPrototype, QuestBaseUpdate } from '../../types/quest';

interface EditorState {
    questPrototype: QuestPrototype | undefined
}

const initialState: EditorState = {
    questPrototype: undefined
}

export const questsSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        loadQuest: (state, action: PayloadAction<QuestPrototype>) => {
            state.questPrototype = action.payload
        },
        unloadQuest: (state) => {
            state.questPrototype = undefined
        },

        updateQuestMeta: (state, action: PayloadAction<QuestBaseUpdate>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype = {...state.questPrototype, ...action.payload}
        },
        addOrUpdateQuestModule: (state, action: PayloadAction<PrototypeModule>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = state.questPrototype.modules
                    .filter(m => m.id !== action.payload.id)
                    .concat(action.payload)
        },
        deleteQuestModule: (state, action: PayloadAction<number>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = state.questPrototype.modules
                    .filter(m => m.id !== action.payload) 
        }

    }
})

export const { loadQuest, unloadQuest, updateQuestMeta, addOrUpdateQuestModule, deleteQuestModule } = questsSlice.actions

export default questsSlice.reducer
