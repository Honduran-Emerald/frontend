import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrototypeModule, QuestPrototype, QuestBaseUpdate } from '../../types/quest';

interface EditorState {
    questPrototype: QuestPrototype | undefined,
    questId: string | undefined,
    imagePath: string
}

const initialState: EditorState = {
    questPrototype: undefined,
    questId: undefined,
    imagePath: ''
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
        },

        setQuestTitle: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.title = action.payload
        },
        setQuestDescription: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.description = action.payload
        },
        setLocationName: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.locationName = action.payload
        },
        setImage: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.imagePath = action.payload
        },
        setEstimatedTime: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.approximateTime = action.payload
        },
        
        

    }
})

export const { loadQuest, unloadQuest, updateQuestMeta, addOrUpdateQuestModule, deleteQuestModule, 
        setQuestTitle, setQuestDescription, setLocationName, setImage, setEstimatedTime } = questsSlice.actions

export default questsSlice.reducer
