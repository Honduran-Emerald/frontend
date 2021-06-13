import { PrototypeChoiceModule, PrototypeModule, PrototypeStoryModule, QuestPrototype } from "../../../types/quest";
import _ from 'lodash';

export interface InternalFullNode {
    id: number,
    type: 'normal',
    setSources: ((questPrototype: QuestPrototype, moduleId: number | null) => PrototypeModule)[]
    moduleObject: PrototypeModule
}

export interface InternalEmptyNode {
    id: string,
    type: 'empty',
    setSource: (questPrototype: QuestPrototype, moduleId: number | null) => PrototypeModule,
    parentId: string | number
}

export type InternalNode = InternalEmptyNode | InternalFullNode

/**
 * 
 * @param link a link between two nodes
 * @param nodes all nodes
 * @param idx id of the link to generate unique virtual nodes
 * @param setSource function to allow the parents link to be changed from the child component
 * @returns virtualized link
 */
const virtualizeEmptyLink = (link: [string|number, string|number], nodes: InternalNode[], idx: number, setSource: (questPrototype: QuestPrototype, moduleId: number | null) => PrototypeModule): [string|number, string|number] => {
    if (link[1] == null) {
        const emptyNodeString = `empty${idx}`
        nodes.push({
            id: emptyNodeString,
            type: 'empty',
            setSource: setSource,
            parentId: link[0]
        })
        return [link[0], emptyNodeString]
    } else {
        (nodes.find(node => node.id === link[1]) as InternalFullNode).setSources.push(setSource)
    }
    return link
}

/**
 * Virtualises empty references and generated graph representation
 * @param questPrototype 
 * @returns graph nodes and link. nodes are annotated with additional information such as linking functions
 */
export const parseModule = (questPrototype: QuestPrototype): {nodes: InternalNode[], links: [string|number, string|number][]} => {

    let nodes: InternalNode[] = questPrototype.modules.map(module => ({id: module.id, type: 'normal', moduleObject: module, setSources: []}));

    let empty_idx = 0;

    let links = questPrototype.modules.map((module, idx): [string|number, string|number][] => {
        switch (module.type) {
            case 'Choice':
                let getSetChoiceSource = (choiceIndex: number) => {
                    return (questPrototype: QuestPrototype, moduleId: number) => {
                        
                        let newQuestPrototype = _.cloneDeep(questPrototype)
                        let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypeChoiceModule )
                        if (!newModule) {
                            console.log('Fuck, source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser scheiß code macht depressiv')
                        }
                        (newModule as PrototypeChoiceModule).choices[choiceIndex] = {...(newModule as PrototypeChoiceModule).choices[choiceIndex], nextModuleId: moduleId}
                        return newModule as PrototypeChoiceModule

                    }
                }
    
                //@ts-ignore TODO: Create some better type annotations for this
                return (module as PrototypeChoiceModule).choices.map((choice, choiceIdx) => virtualizeEmptyLink([module.id, choice.nextModuleId], nodes, empty_idx++, getSetChoiceSource(choiceIdx)));
            
            
            case 'Story':
                let setStorySource = (questPrototype: QuestPrototype, moduleId: number) => {
                    let newQuestPrototype = _.cloneDeep(questPrototype)
                    let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypeStoryModule )
                    if (!newModule) {
                        console.log('Fuck, source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser scheiß code macht depressiv')
                    }
                    (newModule as PrototypeStoryModule).nextModuleId = moduleId
                    return newModule as PrototypeStoryModule
                }

                //@ts-ignore TODO: Create some better type annotations for this
                return [virtualizeEmptyLink([module.id, (module as PrototypeStoryModule).nextModuleId], nodes, empty_idx++, setStorySource)];
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