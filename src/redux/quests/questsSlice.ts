import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestHeader, QuestTracker } from '../../types/quest';
import {saveItemLocally} from "../../utils/SecureStore";

interface QuestsState {
    localQuests: QuestHeader[],
    acceptedQuests: QuestTracker[],
    pinnedQuest: QuestTracker | undefined
}

const initialState: QuestsState = {
    localQuests: [],
    acceptedQuests: [],
    pinnedQuest: undefined
}

export const questsSlice = createSlice({
    name: 'quests',
    initialState,
    reducers: {
        setLocalQuests: (state, action: PayloadAction<QuestHeader[]>) => {
            state.localQuests = action.payload
        },
        setAcceptedQuests: (state, action: PayloadAction<QuestTracker[]>) => {
            state.acceptedQuests = action.payload
        },
        acceptQuest: (state, action: PayloadAction<QuestTracker>) => {
            if (!state.acceptedQuests.find(tracker => tracker.trackerId === action.payload.trackerId)) {
                state.acceptedQuests.push(action.payload)
            }
        },
        pinQuest: (state, action: PayloadAction<QuestTracker>) => {
            state.acceptedQuests = state.acceptedQuests.map(quest => quest.trackerId === action.payload.trackerId ? action.payload : quest)
            if (!state.acceptedQuests.find(quest => quest.trackerId === action.payload.trackerId)) {
                console.log('Trying to track not yet accepted quest.')
            } else {
                state.pinnedQuest = action.payload;
                saveItemLocally('PinnedQuestTracker', JSON.stringify(action.payload)).then(() => {}, () => {});
            }
        },
        clearQuestState: (state) => {
            state.pinnedQuest = undefined
            state.acceptedQuests = []
            state.localQuests = []
        }
    }
})

export const { setLocalQuests, setAcceptedQuests, acceptQuest, pinQuest, clearQuestState } = questsSlice.actions

export default questsSlice.reducer
