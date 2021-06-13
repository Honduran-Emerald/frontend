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
        loadQuest: (state, action: PayloadAction<{questId: string, questPrototype: QuestPrototype}>) => {
            state.questPrototype = action.payload.questPrototype
            state.questId = action.payload.questId
        },
        unloadQuest: (state) => {
            state.questPrototype = undefined
            state.questId = undefined
        },

        updateQuestMeta: (state, action: PayloadAction<QuestBaseUpdate>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype = {...state.questPrototype, ...action.payload}
        },
        setModules: (state, action: PayloadAction<PrototypeModule[]>) => {
            console.log('Updating modules to', action.payload)
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = action.payload
        },
        addOrUpdateQuestModule: (state, action: PayloadAction<PrototypeModule>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = state.questPrototype.modules
                    .filter(m => m.id !== action.payload.id)
                    .concat(action.payload)
        },
        addOrUpdateMultipleQuestModules: (state, action: PayloadAction<PrototypeModule[]>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = state.questPrototype.modules
                    .filter(m => !action.payload.find(module => module.id===m.id))
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

export const { loadQuest, unloadQuest, updateQuestMeta, addOrUpdateQuestModule, deleteQuestModule, setModules,
        setQuestTitle, setQuestDescription, setLocationName, setImage, setEstimatedTime, addOrUpdateMultipleQuestModules } = questsSlice.actions

export default questsSlice.reducer
