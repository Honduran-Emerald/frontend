

export interface QuestMeta {
    id: string,
    owner: string,
    title: string,
    description: string,
    image: string,
    createdAt: string,
    votes: number,
    plays: number,
    finishes: number,
    location: Location
}

export interface QuestMetaUpdate {
    title?: string,
    description?: string,
    image?: string,
    location?: Location
}

export interface QuestPath {

    quest: QuestMeta
    modules: {
        module: QuestModule,
        memento: ModuleMememto
    }[]

}

export type ModuleMememto = any

export interface QuestDeep {

    quest: QuestMeta,
    modules: QuestModule[],
    firstModuleId: number

}

export interface QuestModule {
    moduleId: number,
    type: string,
    objective: string,
    components: QuestComponent[],
    links: number[]
}

export interface QuestComponent {
    componentId: string,
    componentType: string
}
