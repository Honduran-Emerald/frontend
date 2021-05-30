import { Location } from './general';

export interface QuestBase {

    id: string,
    title: string,
    description: string,
    imageId: string,
    creationTime: string,
    location: Location,
    tags: string[]
    profileImageId: string,
    profileName: string,
    locationName: string,

}

/**
 * Class for public query
 */
export interface QuestHeader extends QuestBase {
    ownerId: string,
    ownerName: string,
    ownerImageId: string,
    public: boolean,
    version: number,
    votes: number,
    plays: number,
    finishes: number,
}

export interface QuestBaseUpdate {
    approximateTime?: string,
    title?: string,
    description?: string,
    imageId?: string,
    location?: Location,
    tags?: string[],
    profileImageId?: string,
    profileName?: string,
    locationName?: string,

}

export interface QuestPath extends QuestHeader {

    modules: {
        module: PrototypeModule,
        memento: ModuleMememto
    }[]

}

export type ModuleMememto = any

export interface QuestPrototype extends QuestBase {

    approximateTime: string,
    firstModuleId: number,
    modules: PrototypeModule[]

}

export interface PrototypeModule {
    id: number,
    type: string,
    objective: string,
    components: PrototypeComponent[]

}

export interface PrototypeComponent {
    type: string,
}

export interface QuestTracker {
    trackerId: string,
    newestQuestVersion: boolean,
    finished: boolean,
    vote: string,
    creationTime: string,
    questName: string,
    objective: string,
    author: string
}
