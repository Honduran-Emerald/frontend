import React, { MutableRefObject } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { addOrUpdateQuestModule } from '../../../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../../types/quest';
import { InternalFullNode } from '../utils/linksParser';
import BottomSheet from 'reanimated-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
export interface IModuleNode {
    node: InternalFullNode,
    linkOnChoice: ((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined,
    setLinkOnChoice: React.Dispatch<React.SetStateAction<((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined>>,
    linkable: boolean,
    setSheetOptions: React.Dispatch<React.SetStateAction<[string, string, () => void][]>>,
    sheetRef: React.RefObject<BottomSheet>,
    cutModule: () => void;
}

export const RegularModuleNode: React.FC<IModuleNode> = ({ node, linkOnChoice, setLinkOnChoice, linkable , setSheetOptions, sheetRef, cutModule}) => {

    const questPrototype = useAppSelector((state) => state.editor.questPrototype);
    const dispatch = useAppDispatch();
    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => {
            if (linkOnChoice !== undefined && questPrototype !== undefined && linkable) {
                dispatch(addOrUpdateQuestModule(linkOnChoice(questPrototype, node.id as number)))
                setLinkOnChoice(undefined)
            } else {
                setSheetOptions([['Edit Module', 'puzzle-edit-outline', () => {
                    navigation.navigate('EditModule', {
                        node: node
                    })
                }], ['Seperate Module', 'box-cutter', () => {
                    cutModule();
                }]])

                sheetRef.current?.snapTo(0)
            }
        }}>
            <Text 
                style={{...styles.textcomponent, backgroundColor: (linkOnChoice && linkable)?'green':'white'// TODO: do something fancy here. 
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