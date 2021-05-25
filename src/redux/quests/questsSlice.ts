import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestMeta, QuestPath } from '../../types/quest';

interface QuestsState {
    localQuests: QuestMeta[],
    acceptedQuests: (QuestMeta | QuestPath)[],
    trackedQuest: QuestPath | undefined
}

const initialState: QuestsState = {
    localQuests: [],
    acceptedQuests: [],
    trackedQuest: undefined
}

export const questsSlice = createSlice({
    name: 'quests',
    initialState,
    reducers: {
        setLocalQuests: (state, action: PayloadAction<QuestMeta[]>) => {
            state.localQuests = action.payload
        },

        setAcceptedQuests: (state, action: PayloadAction<(QuestMeta | QuestPath)[]>) => {
            state.acceptedQuests = action.payload
        },
        acceptQuest: (state, action: PayloadAction<QuestMeta | QuestPath>) => {
            if (!state.acceptedQuests.find(quest => quest.id === action.payload.id)) {
                state.acceptedQuests.push(action.payload)
            }
        },
        loadPath: (state, action: PayloadAction<QuestPath>) => {
            state.acceptedQuests = state.acceptedQuests.map(quest => quest.id === action.payload.id ? action.payload : quest)
        },


        trackQuest: (state, action: PayloadAction<QuestPath>) => {
            state.acceptedQuests = state.acceptedQuests.map(quest => quest.id === action.payload.id ? action.payload : quest)
            if (!state.acceptedQuests.find(quest => quest.id === action.payload.id)) {
                state.acceptedQuests.push(action.payload)
            }
            state.trackedQuest = action.payload
        },
        untrackQuest: (state) => {
            state.trackedQuest = undefined
        }
    }
})

export const { setLocalQuests, setAcceptedQuests, acceptQuest, trackQuest } = questsSlice.actions

export default questsSlice.reducer
