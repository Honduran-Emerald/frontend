import React, { MutableRefObject } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { addOrUpdateQuestModule } from '../../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../types/quest';
import { InternalNode } from './linksParser';

export interface IModuleNode {
    node: InternalNode
    linkOnChoice: MutableRefObject<((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined>
}

export const ModuleNode: React.FC<IModuleNode> = ({ node, linkOnChoice }) => {

    const questPrototype = useAppSelector((state) => state.editor.questPrototype);
    const dispatch = useAppDispatch();

    return (
        <TouchableOpacity onPress={() => {
            console.log('Press ModuleNode', linkOnChoice!==undefined, questPrototype!==undefined)
            if (linkOnChoice.current !== undefined && questPrototype !== undefined) {
                console.log('Module Node', node.id)
                dispatch(addOrUpdateQuestModule(linkOnChoice.current(questPrototype, node.id as number)))
                linkOnChoice.current = undefined
            }
        }}>
            <Text style={styles.textcomponent}>{node.id}</Text>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    textcomponent: {
        width: 70,
        height: 60,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1
    }
})