import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestMeta, QuestModule, QuestDeep, QuestMetaUpdate } from '../../types/quest';

interface EditorState {
    questDeep: QuestDeep | undefined
}

const initialState: EditorState = {
    questDeep: undefined
}

export const questsSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        loadQuest: (state, action: PayloadAction<QuestDeep>) => {
            state.questDeep = action.payload
        },
        unloadQuest: (state) => {
            state.questDeep = undefined
        },

        updateQuestMeta: (state, action: PayloadAction<QuestMetaUpdate>) => {
            if (state.questDeep !== undefined)
                state.questDeep.quest = {...state.questDeep.quest, ...action.payload}
        },
        addOrUpdateQuestModule: (state, action: PayloadAction<QuestModule>) => {
            if (state.questDeep !== undefined)
                state.questDeep.modules = state.questDeep.modules
                    .filter(m => m.moduleId !== action.payload.moduleId)
                    .concat(action.payload)
        },
        deleteQuestModule: (state, action: PayloadAction<number>) => {
            if (state.questDeep !== undefined)
                state.questDeep.modules = state.questDeep.modules
                    .filter(m => m.moduleId !== action.payload) 
        }

    }
})

export const { loadQuest, unloadQuest, updateQuestMeta, addOrUpdateQuestModule, deleteQuestModule } = questsSlice.actions

export default questsSlice.reducer
