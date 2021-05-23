import { QuestModule, QuestMeta } from "./quest";

export interface QuestAPI extends QuestMeta {}

export interface EventAPI {
    type: string,
    reponseEvent: {
        module?: QuestModule
    }
}

export interface QuestQueryAPI {
    quests: QuestMeta[]
}

export interface CreateQueryAPI {
    quest: QuestMeta,
    modules: QuestModule[],
    firstModuleId: string
}