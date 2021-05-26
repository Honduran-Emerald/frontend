import { Location } from './general';

export interface QuestBase {

    id: string,
    title: string,
    description: string,
    imageId: string,
    creationTime: Date,
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
