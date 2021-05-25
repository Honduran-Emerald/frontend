

export interface QuestMeta {
    id: string,
    ownerId: string,
    title: string,
    description: string,
    image: string,
    version: number,
    creationTime: string,
    votes: number,
    plays: number,
    finishes: number,
    location: {
        longitude: number,
        latitude: number
    }
}

export interface QuestPath extends QuestMeta {

    modules: {
        module: QuestModule,
        memento: ModuleMememto
    }[]

}

export type ModuleMememto = any

export interface QuestDeep extends QuestMeta {

    firstModuleId: string,
    modules: QuestModule[]

}

export interface QuestModule {
    moduleId: string,
    type: string,
    objective: string,
    components: QuestComponent[]
}

export interface QuestComponent {
    componentId: string,
    componentType: string
}
