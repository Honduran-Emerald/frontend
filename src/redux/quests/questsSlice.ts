import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestHeader, QuestPath, QuestTracker } from '../../types/quest';

interface QuestsState {
    localQuests: QuestHeader[],
    acceptedQuests: QuestTracker[],
    pinnedQuest: QuestTracker | undefined,
    pinnedQuestPath: QuestPath | undefined
}

const initialState: QuestsState = {
    localQuests: [],
    acceptedQuests: [],
    pinnedQuest: undefined,
    pinnedQuestPath: undefined
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
        updateAcceptedQuest: (state, action: PayloadAction<QuestTracker>) => {
            const oldTracker = state.acceptedQuests.find(tracker => tracker.trackerId === action.payload.trackerId);
            if(oldTracker) {
                const index = state.acceptedQuests.indexOf(oldTracker);
                if(index !== -1) {
                    state.acceptedQuests[index] = action.payload;
                }
            }
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
                if (state.pinnedQuest?.questId !== action.payload.questId) {
                    state.pinnedQuestPath = undefined
                }
                state.pinnedQuest = action.payload;
            }
        },
        loadPinnedQuestPath: (state, action: PayloadAction<QuestPath>) => {
            state.pinnedQuestPath = action.payload
        },
        clearQuestState: (state) => {
            state.pinnedQuest = undefined
            state.pinnedQuestPath = undefined
            state.acceptedQuests = []
            state.localQuests = []
        }
    }
})

export const { setLocalQuests, setAcceptedQuests, updateAcceptedQuest, acceptQuest, pinQuest, clearQuestState, loadPinnedQuestPath } = questsSlice.actions

export default questsSlice.reducer
