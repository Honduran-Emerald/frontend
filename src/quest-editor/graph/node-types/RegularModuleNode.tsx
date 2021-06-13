import React, { MutableRefObject } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { addOrUpdateQuestModule, setModules } from '../../../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../../types/quest';
import { InternalFullNode } from '../utils/linksParser';
import BottomSheet from 'reanimated-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
export interface IModuleNode {
    node: InternalFullNode,
    linkOnChoice: ((questPrototype: QuestPrototype, module_id: number) => QuestPrototype) | undefined,
    setLinkOnChoice: React.Dispatch<React.SetStateAction<((questPrototype: QuestPrototype, module_id: number) => QuestPrototype) | undefined>>,
    linkable: boolean,
    setSheetOptions: React.Dispatch<React.SetStateAction<[string, string, () => void][]>>,
    sheetRef: React.RefObject<BottomSheet>,
    cutModule: () => void;
    deleteModule: () => void;
}

export const RegularModuleNode: React.FC<IModuleNode> = ({ node, linkOnChoice, setLinkOnChoice, linkable , setSheetOptions, sheetRef, cutModule, deleteModule}) => {

    const questPrototype = useAppSelector((state) => state.editor.questPrototype);
    const dispatch = useAppDispatch();
    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => {
            if (linkOnChoice !== undefined && questPrototype !== undefined && linkable) {
                console.log('PreLink \nModules ---------', linkOnChoice(questPrototype, node.id as number).modules)
                dispatch(setModules(linkOnChoice(questPrototype, node.id as number).modules))
                console.log('PostLink')
                setLinkOnChoice(undefined)
            } else {
                // Sheet Options on Click
                setSheetOptions([['Edit Module', 'puzzle-edit-outline', () => {
                    navigation.navigate('EditModule', {
                        node: node
                    })
                }], ['Seperate Module', 'box-cutter', () => {
                    cutModule();
                }], ['Delete Module', 'delete', () => {
                    deleteModule();
                }]])

                sheetRef.current?.snapTo(1)
            }
        }}>
            <Text 
                style={{...styles.textcomponent, 
                    backgroundColor: 'white',
                    borderColor: (linkOnChoice && linkable)? 'lime' : 'black'// TODO: do something fancy here. 
                // If (linkOnChoice && linkable), then the user currently tries to link a node and this node is a valid candidate.
            }}>
                    {node.moduleObject.objective}
            </Text>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    textcomponent: {
        minWidth: 70,
        maxWidth: 120,
        padding: 15,
        minHeight: 60,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1
    }
})