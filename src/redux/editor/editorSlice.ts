import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrototypeModule, QuestPrototype } from '../../types/prototypes';
import { NewImage, Image } from '../../types/quest';

interface EditorState {
    questPrototype: QuestPrototype | undefined,
    questId: string | undefined,
    newImages: NewImage[],
    unsavedChanges: boolean,
}

const initialState: EditorState = {
    questPrototype: undefined,
    questId: undefined,
    newImages: [],
    unsavedChanges: false,
}

export const questsSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        loadQuest: (state, action: PayloadAction<{questId: string, questPrototype: QuestPrototype}>) => {
            state.questPrototype = action.payload.questPrototype;
            state.questId = action.payload.questId;
            state.newImages = [];
            state.unsavedChanges = false;
        },
        unloadQuest: (state) => {
            state.questPrototype = undefined;
            state.questId = undefined;
            state.unsavedChanges = false;
        },

        setModules: (state, action: PayloadAction<PrototypeModule[]>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = action.payload;
            state.unsavedChanges = true;
        },
        addOrUpdateQuestModule: (state, action: PayloadAction<PrototypeModule>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = state.questPrototype.modules
                    .filter(m => m.id !== action.payload.id)
                    .concat(action.payload)
            state.unsavedChanges = true;
        },
        addOrUpdateMultipleQuestModules: (state, action: PayloadAction<PrototypeModule[]>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.modules = state.questPrototype.modules
                    .filter(m => !action.payload.find(module => module.id===m.id))
                    .concat(action.payload)
            state.unsavedChanges = true;
        },
        deleteQuestModule: (state, action: PayloadAction<number>) => {
            if (state.questPrototype !== undefined) {
                const oldLength = state.questPrototype.modules.length;
                state.questPrototype.modules = state.questPrototype.modules
                    .filter(m => m.id !== action.payload) 
                if (oldLength !== state.questPrototype.modules.length && !state.questPrototype.modules.some(m => m.id === state.questPrototype?.firstModuleReference)) {
                    if (state.questPrototype.modules.length > 0) {
                        state.questPrototype.firstModuleReference = state.questPrototype.modules[0].id
                    } else {
                        state.questPrototype.firstModuleReference = 1
                    }
                    
                }
            }
            state.unsavedChanges = true;
        },
        spliceQuestImages: (state, action: PayloadAction<number>) => {
            if(state.questPrototype?.images !== undefined)
                state.questPrototype.images.splice(action.payload, 1);
            state.unsavedChanges = true;
        },
        setQuestTitle: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.title = action.payload
            state.unsavedChanges = true;
        },
        setQuestDescription: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.description = action.payload
            state.unsavedChanges = true;
        },
        setLocationName: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.locationName = action.payload
            state.unsavedChanges = true;
        },
        setImages: (state, action: PayloadAction<Image[]>) => {
            if(state.questPrototype !== undefined)
                state.questPrototype.images = action.payload
            state.unsavedChanges = true;
        },
        setEstimatedTime: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.approximateTime = action.payload
            state.unsavedChanges = true;
        },
        setImageReference: (state, action: PayloadAction<number>) => {
            if(state.questPrototype !== undefined)
                state.questPrototype.imageReference = action.payload; 
            state.unsavedChanges = true;
        },
        setAgentImageReference: (state, action: PayloadAction<number>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.agentProfileReference = action.payload
            state.unsavedChanges = true;
        },
        setAgentName: (state, action: PayloadAction<string>) => {
            if (state.questPrototype !== undefined)
                state.questPrototype.agentProfileName = action.payload
            state.unsavedChanges = true;
        },
        setNewImages: (state, action: PayloadAction<NewImage[]>) => {
            state.newImages = action.payload;
            state.unsavedChanges = true;
        },
        pushNewImages: (state, action: PayloadAction<NewImage>) => {
            state.newImages.push(action.payload);
            state.unsavedChanges = true;
        },
        setNewImagesAt: (state, action: PayloadAction<{index: number, value: NewImage}>) => {
            state.newImages[action.payload.index] = action.payload.value; 
            state.unsavedChanges = true;
        },
        setNewImageReference: (state, action: PayloadAction<{base64: string, reference: number}>) => {
            if (state.questPrototype !== undefined) {
                state.questPrototype.images = state.questPrototype.images.filter(image => image.reference !== action.payload.reference)
            }
            state.newImages = state.newImages.filter(image => image.reference !== action.payload.reference)
            state.newImages.push({
                image: action.payload.base64,
                reference: action.payload.reference
            })
            state.unsavedChanges = true;
        },
        toggleAgentEnabled: (state) => {
            if (state.questPrototype !== undefined) {
                state.questPrototype.agentEnabled = !state.questPrototype.agentEnabled
            }
            state.unsavedChanges = true;
        },
        saveChanges: (state) => {
            state.unsavedChanges = false
        },
        setFirstModuleReference: (state, action: PayloadAction<number | null>) => {
            if (state.questPrototype) 
                state.questPrototype.firstModuleReference = action.payload
        }

    }
})

export const { loadQuest, unloadQuest, addOrUpdateQuestModule, deleteQuestModule, setModules, setFirstModuleReference,
        setQuestTitle, setQuestDescription, setLocationName, setImages, setImageReference, saveChanges,
        setEstimatedTime, addOrUpdateMultipleQuestModules, spliceQuestImages, setNewImages, pushNewImages, 
        setNewImagesAt, setNewImageReference, setAgentImageReference, setAgentName, toggleAgentEnabled} = questsSlice.actions

export default questsSlice.reducer
