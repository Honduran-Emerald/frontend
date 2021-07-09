import _ from 'lodash';
import { PrototypeChoiceModule, PrototypeLocationModule, PrototypeModule, PrototypePassphraseModule, PrototypeQRModule, PrototypeRandomModule, PrototypeStoryModule, QuestPrototype } from '../../../types/prototypes';

export interface ChoiceTag {
    type: 'Choice'
    choice: string
}

export interface RandomTag {
    type: 'Random'
    probability: number
}

export type GraphTag = ChoiceTag | RandomTag;

export interface InternalFullNode {
    id: number,
    type: 'normal',
    setSources: ((questPrototype: QuestPrototype, moduleId: number | null) => QuestPrototype)[],
    parentTags: GraphTag[],
    moduleObject: PrototypeModule
}

export interface InternalEmptyNode {
    id: string,
    type: 'empty',
    setSource: (questPrototype: QuestPrototype, moduleId: number | null) => QuestPrototype,
    parentId: string | number
    parentTags: GraphTag[],
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
const virtualizeEmptyLink = (link: [string|number, string|number], nodes: InternalNode[], idx: number, setSource: (questPrototype: QuestPrototype, moduleId: number | null) => QuestPrototype, parentTag?: GraphTag): [string|number, string|number] => {
    if (link[1] == null) {
        const emptyNodeString = `empty${idx}`
        nodes.push({
            id: emptyNodeString,
            type: 'empty',
            setSource: setSource,
            parentId: link[0],
            parentTags: parentTag ? [parentTag] : []
        })
        return [link[0], emptyNodeString]
    } else {
        const targetNode = (nodes.find(node => node.id === link[1]) as InternalFullNode);
        targetNode.setSources.push(setSource)
        if (parentTag !== undefined) {
            targetNode.parentTags?.push(parentTag)
        } 
    
        //console.log('Called on', link[1], '-- length sour sources array', (nodes.find(node => node.id === link[1]) as InternalFullNode).setSources);
    }
    return link
}

/**
 * Virtualises empty references and generated graph representation
 * @param questPrototype 
 * @returns graph nodes and link. nodes are annotated with additional information such as linking functions
 */
export const parseModule = (questPrototype: QuestPrototype): {nodes: InternalNode[], links: [string|number, string|number][]} => {


    let nodes: InternalNode[] = questPrototype.modules.map(module => ({id: module.id, type: 'normal', moduleObject: module, setSources: [], parentTags: []}));

    let empty_idx = 0;

    let links = questPrototype.modules.map((module, idx): [string|number, string|number][] => {
        switch (module.type) {
            case 'Choice':
                let getSetChoiceSource = (choiceIndex: number) => {
                    //console.log('generated with idx', choiceIndex)
                    return (questPrototype: QuestPrototype, moduleId: number) => {
                        //console.log('Setting sourece:', module.id, '| Index:', choiceIndex, 'to', moduleId)
                        let newQuestPrototype = _.cloneDeep(questPrototype)
                        let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypeChoiceModule )
                        if (!newModule) {
                            console.log('Source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser code macht depressiv')
                        }
                        (newModule as PrototypeChoiceModule).choices[choiceIndex] = {...(newModule as PrototypeChoiceModule).choices[choiceIndex], nextModuleReference: moduleId}
                        //return newModule as PrototypeChoiceModule
                        return newQuestPrototype 

                    }
                }
    
                //@ts-ignore TODO: Create some better type annotations for this
                return (module as PrototypeChoiceModule).choices.map((choice, choiceIdx) => virtualizeEmptyLink([module.id, choice.nextModuleReference], nodes, empty_idx++, getSetChoiceSource(choiceIdx), {type: 'Choice', choice: choice.text}));
            
            
            case 'Story':
                let setStorySource = (questPrototype: QuestPrototype, moduleId: number) => {
                    let newQuestPrototype = _.cloneDeep(questPrototype)
                    let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypeStoryModule )
                    if (!newModule) {
                        console.log('Source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser code macht depressiv')
                    }
                    (newModule as PrototypeStoryModule).nextModuleReference = moduleId
                    //return newModule as PrototypeStoryModule
                    return newQuestPrototype
                }

                //@ts-ignore TODO: Create some better type annotations for this
                return [virtualizeEmptyLink([module.id, (module as PrototypeStoryModule).nextModuleReference], nodes, empty_idx++, setStorySource)];
            
            case 'Location':
                let setLocationSource = (questPrototype: QuestPrototype, moduleId: number) => {
                    let newQuestPrototype = _.cloneDeep(questPrototype)
                    let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypeLocationModule )
                    if (!newModule) {
                        console.log('Source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser code macht depressiv')
                    }
                    (newModule as PrototypeLocationModule).nextModuleReference = moduleId
                    //return newModule as PrototypeStoryModule
                    return newQuestPrototype
                }

                //@ts-ignore TODO: Create some better type annotations for this
                return [virtualizeEmptyLink([module.id, (module as PrototypeLocationModule).nextModuleReference], nodes, empty_idx++, setLocationSource)];

            case 'Ending':
                return [];

            case 'Random':
                let getSetRandomSource = (pathIndex: number) => {
                    //console.log('generated with idx', choiceIndex)
                    return (questPrototype: QuestPrototype, moduleId: number) => {
                        //console.log('Setting sourece:', module.id, '| Index:', choiceIndex, 'to', moduleId)
                        let newQuestPrototype = _.cloneDeep(questPrototype)
                        let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypeRandomModule )
                        if (!newModule) {
                            console.log('Source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser code macht depressiv')
                        }
                        (newModule as PrototypeRandomModule).paths[pathIndex] = {...(newModule as PrototypeRandomModule).paths[pathIndex], nextModuleReference: moduleId}
                        //return newModule as PrototypeChoiceModule
                        return newQuestPrototype 

                    }
                }
    
                //@ts-ignore TODO: Create some better type annotations for this
                return (module as PrototypeRandomModule).paths.map((path, pathIdx) => virtualizeEmptyLink([module.id, path.nextModuleReference], nodes, empty_idx++, getSetRandomSource(pathIdx), {type: 'Random', probability: path.weight}));
            
            case 'Passphrase':
                let setPassphraseSource = (questPrototype: QuestPrototype, moduleId: number) => {
                    let newQuestPrototype = _.cloneDeep(questPrototype)
                    let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypePassphraseModule )
                    if (!newModule) {
                        console.log('Source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser code macht depressiv')
                    }
                    (newModule as PrototypePassphraseModule).nextModuleReference = moduleId
                    //return newModule as PrototypeStoryModule
                    return newQuestPrototype
                }

                //@ts-ignore TODO: Create some better type annotations for this
                return [virtualizeEmptyLink([module.id, (module as PrototypePassphraseModule).nextModuleReference], nodes, empty_idx++, setPassphraseSource)];

            case 'QrCode':
                let setQRSource = (questPrototype: QuestPrototype, moduleId: number) => {
                    let newQuestPrototype = _.cloneDeep(questPrototype)
                    let newModule = newQuestPrototype.modules.find(m => m.id === module.id) as (undefined | PrototypeQRModule )
                    if (!newModule) {
                        console.log('Source module does not exist. Kontaktier Lenny und schau dir das bitte nicht an weil dieser code macht depressiv')
                    }
                    (newModule as PrototypeQRModule).nextModuleReference = moduleId
                    //return newModule as PrototypeStoryModule
                    return newQuestPrototype
                }

                //@ts-ignore TODO: Create some better type annotations for this
                return [virtualizeEmptyLink([module.id, (module as PrototypeQRModule).nextModuleReference], nodes, empty_idx++, setQRSource)];

            default:
                return [];
        }
    }).reduce((acc, curVal) => acc.concat(curVal), [])

    return {
        nodes: nodes,
        links: links,
    }
}