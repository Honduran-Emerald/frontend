import { Location } from './general';

export interface QuestBase {

    id: string,
    title: string,
    description: string,
    imageId: string,
    creationTime: string,
    location: Location,
    tags: string[],
    agentProfileImageId: string,
    agentProfileName: string,
    locationName: string,
    approximateTime: string,

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
    agentProfileImageId?: string,
    agentProfileName?: string,
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
    firstModuleReference: number | null,
    modules: PrototypeModule[]

}

export interface PrototypeModuleBase {
    id: number,
    type: string,
    objective: string,
    components: PrototypeComponent[]
  
}

export interface PrototypeChoiceModule extends PrototypeModuleBase {
    type: 'Choice'
    choices: {
        text: string,
        nextModuleReference: number | null,
    }[]
}

export interface PrototypeStoryModule extends PrototypeModuleBase {  
    type: 'Story'
    nextModuleReference: number | null,
}

export interface PrototypeEndingModule extends PrototypeModuleBase {
    type: 'Ending',
    endingFactor: number,
}

export type PrototypeModule = PrototypeChoiceModule | PrototypeEndingModule | PrototypeStoryModule

export interface TextComponent {
    type: 'text',
    text: string,
}

export interface ImageComponent {
    type: 'image',
    imageReference: string,
}

export type PrototypeComponent = TextComponent | ImageComponent

export interface QuestTracker {
    questId: string,
    trackerId: string,
    newestQuestVersion: boolean,
    finished: boolean,
    vote: string,
    creationTime: string,
    questName: string,
    agentProfileImageId: string,
    agentProfileName: string,
    objective: string,
    author: string
}
