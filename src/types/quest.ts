import { Location } from './general';

export interface QuestBase {
    id: string,
    title: string,
    description: string,
    //creationTime: string,
    location: Location,
    tags: string[],
    agentProfileName: string,
    locationName: string,
    approximateTime: string,
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
    creationTime: string,
}

export interface GameplayQuestHeader extends QuestHeader {
    imageId: string,
    agentProfileImageId: string,
}

export interface QueriedQuest {
    id: string,
    ownerId: string,
    tracker: QuestTracker,
    ownerName: string,
    ownerImageId: string,
    public: boolean,
    version: number,
    approximateTime: string,
    locationName: string,
    title: string,
    description: string,
    tags: string[],
    location: Location,
    imageId: string,
    agentProfileImageId: string,
    agentProfileName: string,
    creationTime: string,
    votes: number,
    plays: number,
    finishes: number,
    released: boolean,
    outdated: boolean,
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

export interface QuestWithTopTrackerNode extends GameplayQuestHeader {
    tracker: QuestTracker
}
export interface QuestPath extends GameplayQuestHeader {

    modules: {
        module: GameplayModule,
        memento: ModuleMememto
    }[]

}

export interface QuestPath  {
    trackerNodes: QuestTrackerNodeElement[],
    quest: QuestWithTopTrackerNode
}

export type ModuleMememto = any

export interface GameplayModuleBase {
    id: number,
    components: GameplayComponent[],
    objective: string,
    type: string,
}

export interface GameplayChoiceModule extends GameplayModuleBase {
    type: 'Choice'
    choices: {
        text: string,
    }[]
}

export interface GameplayStoryModule extends GameplayModuleBase {
    type: 'Story'
}

export interface GameplayEndingModule extends GameplayModuleBase {
    type: 'Ending',
}

export interface GameplayLocationModule extends GameplayModuleBase {
    type: 'Location',
    location: Location,
}

export type GameplayModule = GameplayChoiceModule | GameplayEndingModule | GameplayStoryModule | GameplayLocationModule

export interface ComponentBase {
    componentId: string
}

export interface GameplayTextComponent extends ComponentBase {
    componentType: 'Text',
    text: string,
}

export interface GameplayImageComponent extends ComponentBase {
    componentType: 'Image',
    imageId: string,
}

export type GameplayComponent = GameplayTextComponent | GameplayImageComponent

export interface QuestTracker {
    questId: string,
    trackerId: string,
    newestQuestVersion: boolean,
    finished: boolean,
    vote: Vote,
    creationTime: string,
    questName: string,
    agentProfileImageId: string,
    agentProfileName: string,
    objective: string,
    author: string,
    experienceCollected: number
    trackerNode: QuestTrackerNode
}

export type QuestTrackerNode = QuestTrackerNodeElement

export interface QuestTrackerNodeElement {
    module: GameplayModule,
    memento: ModuleMememto,
    creationTime: string
}

export type Vote = 'None' | 'Up' | 'Down'

