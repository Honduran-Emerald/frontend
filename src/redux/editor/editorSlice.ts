import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrototypeModule, QuestPrototype } from '../../types/prototypes';
import { NewImage, Image } from '../../types/quest';

interface EditorState {
    questPrototype: QuestPrototype | undefined,
    questId: string | undefined,
    imagePath: string,
    newImages: NewImage[]
}

const initialState: EditorState = {
    questPrototype: undefined,
    questId: undefined,
    imagePath: '',
    newImages: []
}

export const questsSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        loadQuest: (state, action: PayloadAction<{questId: string, questPrototype: QuestPrototype}>) => {
            state.questPrototype = action.payload.questPrototype;
            state.questId = action.payload.questId;
            state.imagePath = '';
            state.newImages = [];
        },
        unloadQuest: (state) => {
            state.questPrototype = undefined
            state.questId = undefined
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
        spliceQuestImages: (state, action: PayloadAction<number>) => {
            if(state.questPrototype?.images !== undefined)
                state.questPrototype.images.splice(action.payload, 1);
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
        setImagePath: (state, action: PayloadAction<string>) => {
            if (state.imagePath !== undefined)
                state.imagePath = action.payload
        },
        setImages: (state, action: PayloadAction<Image[]>) => {
            if(state.questPrototype !== undefined)
                state.questPrototype.images = action.payload
        },
        setEstimatedTime: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.approximateTime = action.payload
        },
        setImageReference: (state, action: PayloadAction<number>) => {
            if(state.questPrototype !== undefined)
                state.questPrototype.imageReference = action.payload; 
        },
        setNewImages: (state, action: PayloadAction<NewImage[]>) => {
            if(state.newImages !== undefined)
                state.newImages = action.payload;
        },
        pushNewImages: (state, action: PayloadAction<NewImage>) => {
            if(state.newImages !== undefined)
                state.newImages.push(action.payload);
        },
        setNewImagesAt: (state, action: PayloadAction<{index: number, value: NewImage}>) => {
            if(state.newImages !== undefined)
                state.newImages[action.payload.index] = action.payload.value; 
        }

    }
})

export const { loadQuest, unloadQuest, addOrUpdateQuestModule, deleteQuestModule, setModules,
        setQuestTitle, setQuestDescription, setLocationName, setImagePath, setImages, setImageReference, setEstimatedTime, addOrUpdateMultipleQuestModules, spliceQuestImages, setNewImages, pushNewImages, setNewImagesAt} = questsSlice.actions

export default questsSlice.reducer
