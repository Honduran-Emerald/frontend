import { PrototypeModule, QuestPrototype } from "../../types/quest";
import _ from 'lodash';

interface ChoiceModule extends PrototypeModule {
    choices: {text: string, nextModuleId: number}[]
}

interface StoryModule extends PrototypeModule {
    nextModuleId: number
}

export interface InternalFullNode {
    id: number,
    type: 'normal',
    moduleObject: PrototypeModule
}

export interface InternalEmptyNode {
    id: string,
    type: 'empty',
    setSource: (questPrototype: QuestPrototype, moduleId: number) => PrototypeModule,
    parentId: string | number
}

export type InternalNode = InternalEmptyNode | InternalFullNode

const virtualizeEmptyLink = (link: [string|number, string|number], nodes: InternalNode[], idx: number, setSource: (questPrototype: QuestPrototype, moduleId: number) => PrototypeModule): [string|number, string|number] => {
    if (link[1] == null) {
        const emptyNodeString = `empty${idx}`
        nodes.push({
            id: emptyNodeString,
            type: 'empty',
            setSource: setSource,
            parentId: link[0]
        })
        return [link[0], emptyNodeString]
    } 
    return link
}

export const graph_connections = (questPrototype: QuestPrototype): {nodes: InternalNode[], links: [string|number, string|number][]} => {

    let nodes: InternalNode[] = questPrototype.modules.map(module => ({id: module.id, type: 'normal', moduleObject: module}));

    let empty_idx = 0;

    let links = questPrototype.modules.map((module, idx): [string|number, string|number][] => {
        switch (module.type) {
            case 'Choice':
                let getSetChoiceSource = (choiceIndex: number) => {
                    return (questPrototype: QuestPrototype, moduleId: number) => {
                        
                        let newQuestPrototype = _.cloneDeep(questPrototype)
                        let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | ChoiceModule )
                        if (!newModule) {
                            console.log('Fuck, source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser scheiß code macht depressiv')
                        }
                        (newModule as ChoiceModule).choices[choiceIndex] = {...(newModule as ChoiceModule).choices[choiceIndex], nextModuleId: moduleId}
                        return newModule as ChoiceModule

                    }
                }
                
                return (module as ChoiceModule).choices.map((choice, choiceIdx) => virtualizeEmptyLink([module.id, choice.nextModuleId], nodes, empty_idx++, getSetChoiceSource(choiceIdx)));
            case 'Story':
                let setStorySource = (questPrototype: QuestPrototype, moduleId: number) => {
                    let newQuestPrototype = _.cloneDeep(questPrototype)
                    let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | StoryModule )
                    if (!newModule) {
                        console.log('Fuck, source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser scheiß code macht depressiv')
                    }
                    (newModule as StoryModule).nextModuleId = moduleId
                    return newModule as StoryModule
                }
                return [virtualizeEmptyLink([module.id, (module as StoryModule).nextModuleId], nodes, empty_idx++, setStorySource)];
            case 'Ending':
                return [];
            default:
                return [];
        }
    }).reduce((acc, curVal) => acc.concat(curVal), [])

    return {
        nodes: nodes,
        links: links,
    }
}