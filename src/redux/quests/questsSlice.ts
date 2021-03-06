import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueriedQuest, QuestHeader, QuestPath, QuestTracker, QuestTrackerNode, Vote } from '../../types/quest';

interface QuestsState {
    localQuests: QuestHeader[],
    acceptedQuests: QuestTracker[],
    pinnedQuest: QuestTracker | undefined,
    pinnedQuestPath: QuestPath | undefined,
    trackerWithUpdates: string[],
    recentlyVisitedQuests: QueriedQuest[],
    liveUpdate: boolean,
}

const initialState: QuestsState = {
    localQuests: [],
    acceptedQuests: [],
    pinnedQuest: undefined,
    pinnedQuestPath: undefined,
    trackerWithUpdates: [],
    recentlyVisitedQuests: [],
    liveUpdate: false,
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
            if(state.pinnedQuest && state.pinnedQuest.trackerId === action.payload.trackerId) {
                state.pinnedQuest = action.payload;
            }
        },
        removeAcceptedQuest: (state, action: PayloadAction<string>) => {
            state.acceptedQuests = state.acceptedQuests.filter(tracker => tracker.trackerId !== action.payload);
        },
        setTrackerFinished: (state, action: PayloadAction<{ trackerId: string, finished: boolean }>) => {
            const oldTracker = state.acceptedQuests.find(tracker => tracker.trackerId === action.payload.trackerId);
            if(oldTracker) {
                const index = state.acceptedQuests.indexOf(oldTracker);
                if(index !== -1) {
                    state.acceptedQuests[index].finished = action.payload.finished;
                }
            }
            if(state.pinnedQuest && state.pinnedQuest.trackerId === action.payload.trackerId) {
                state.pinnedQuest.finished = action.payload.finished;
            }
        },
        setTrackerVote: (state, action: PayloadAction<{ trackerId: string, vote: Vote }>) => {
            const oldTracker = state.acceptedQuests.find(tracker => tracker.trackerId === action.payload.trackerId);
            if(oldTracker) {
                const index = state.acceptedQuests.indexOf(oldTracker);
                if(index !== -1) {
                    state.acceptedQuests[index].vote = action.payload.vote;
                }
            }
            if(state.pinnedQuest && state.pinnedQuest.trackerId === action.payload.trackerId) {
                state.pinnedQuest.vote = action.payload.vote;
            }
        },
        addTrackerExperience: (state, action: PayloadAction<{ trackerId: string, experience: number }>) => {
            const oldTracker = state.acceptedQuests.find(tracker => tracker.trackerId === action.payload.trackerId);
            if(oldTracker) {
                const index = state.acceptedQuests.indexOf(oldTracker);
                if(index !== -1) {
                    state.acceptedQuests[index].experienceCollected = state.acceptedQuests[index].experienceCollected + action.payload.experience;
                }
            }
            if(state.pinnedQuest && state.pinnedQuest.trackerId === action.payload.trackerId) {
                state.pinnedQuest.experienceCollected = state.pinnedQuest.experienceCollected + action.payload.experience;
            }
        },
        setTrackerObjectiveAndTrackerNode: (state, action: PayloadAction<{ trackerId: string, objective: string, trackerNode: QuestTrackerNode }>) => {
            const oldTracker = state.acceptedQuests.find(tracker => tracker.trackerId === action.payload.trackerId);
            if(oldTracker) {
                const index = state.acceptedQuests.indexOf(oldTracker);
                if(index !== -1) {
                    state.acceptedQuests[index].objective = action.payload.objective;
                    state.acceptedQuests[index].trackerNode = action.payload.trackerNode;
                }
            }
            if(state.pinnedQuest && state.pinnedQuest.trackerId === action.payload.trackerId) {
                state.pinnedQuest.objective = action.payload.objective;
                state.pinnedQuest.trackerNode = action.payload.trackerNode;
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
            state.trackerWithUpdates = []
            state.recentlyVisitedQuests = []
        },
        setTrackerWithUpdate: (state, action: PayloadAction<string[]>) => {
            state.trackerWithUpdates = action.payload;
        },
        addTrackerWithUpdate: (state, action: PayloadAction<string>) => {
            if(state.trackerWithUpdates.includes(action.payload)) return;
            state.trackerWithUpdates.push(action.payload);
        },
        removeTrackerWithUpdate: (state, action: PayloadAction<string>) => {
            state.trackerWithUpdates = state.trackerWithUpdates.filter((trackerId) => trackerId !== action.payload);
        },
        setRecentlyVisitedQuest: (state, action: PayloadAction<QueriedQuest[]>) => {
            state.recentlyVisitedQuests = action.payload;
        },
        addRecentlyVisitedQuest: (state, action: PayloadAction<QueriedQuest>) => {
            if(state.recentlyVisitedQuests.length > 19) {
                state.recentlyVisitedQuests.splice(0, 1)
            }
            state.recentlyVisitedQuests.push(action.payload);
        },
        refreshRecentlyVisitedQuest: (state, action: PayloadAction<QueriedQuest>) => {
            const tmp = state.recentlyVisitedQuests.filter(quest => quest.id !== action.payload.id);
            tmp.push(action.payload);
            state.recentlyVisitedQuests = tmp;
        },
        removeRecentlyVisitedQuest: (state, action: PayloadAction<string>) => {
            state.recentlyVisitedQuests = state.recentlyVisitedQuests.filter(quest => quest.id !== action.payload);
        },
        setLiveUpdate: (state, action: PayloadAction<boolean>) => {
            state.liveUpdate = action.payload
        }
    }
})

export const {
    setLocalQuests,
    setAcceptedQuests,
    removeAcceptedQuest,
    updateAcceptedQuest,
    setTrackerFinished,
    setTrackerVote,
    addTrackerExperience,
    setTrackerObjectiveAndTrackerNode,
    acceptQuest,
    pinQuest,
    clearQuestState,
    loadPinnedQuestPath,
    setTrackerWithUpdate,
    addTrackerWithUpdate,
    removeTrackerWithUpdate,
    setRecentlyVisitedQuest,
    addRecentlyVisitedQuest,
    refreshRecentlyVisitedQuest,
    removeRecentlyVisitedQuest,
    setLiveUpdate,
} = questsSlice.actions

export default questsSlice.reducer
