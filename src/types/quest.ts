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

export interface CreateQuestBase {
    id: string,
    title: string,
    description: string,
    tags: string[],
    locationName: string,
    location: Location,
    imageReference: number | null,
    approximateTime: string,
    agentProfileReference: string,
    agentProfileName: string,
    firstModuleReference: number,
    modules: PrototypeModule[],
    images: Image[],
}

export interface PutQuest {
    questId: string,
    questProtoype: CreateQuestBase,
    newImages: NewImage[]
}

export interface Image {
    reference: number,
    imageId: string
}

export interface NewImage {
    reference: number,
    image: string
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
    components: PrototypeComponent[],
    objective: string,
    type: string,
  
}

export interface PrototypeChoiceModule extends PrototypeModuleBase{
    choices: {
        text: string,
        nextModuleReference: number | null,
    }[]
}

export interface PrototypeStoryModule extends PrototypeModuleBase {  
    nextModuleReference: number | null,
}

export interface PrototypeEndingModule extends PrototypeModuleBase {
    endingFactor: number,
}

export interface PrototypeLocationModule extends PrototypeModuleBase {
    location: Location,
    nextModuleReference: number | null
}

export type PrototypeModule = PrototypeChoiceModule | PrototypeEndingModule | PrototypeStoryModule | PrototypeLocationModule

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
