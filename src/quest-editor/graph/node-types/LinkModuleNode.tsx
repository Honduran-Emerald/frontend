import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { addOrUpdateQuestModule, setModules } from '../../../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/core';
import I18n from 'i18n-js';
import BottomSheet from 'reanimated-bottom-sheet';
import { QuestPrototype } from '../../../types/prototypes';
import { GraphTag } from '../utils/linksParser';

interface ILinkModuleNode {
    setSource: (questPrototype: QuestPrototype, moduleId: number) => QuestPrototype,
    setLinkOnChoice: React.Dispatch<React.SetStateAction<((questPrototype: QuestPrototype, module_id: number) => QuestPrototype) | undefined>>,
    sheetRef: React.RefObject<BottomSheet>,
    setSheetOptions: React.Dispatch<React.SetStateAction<[string, string, () => void][]>>,
    setLinkSourceId: React.Dispatch<React.SetStateAction<string | number | undefined>>,
    parentId: number | string | undefined,
    parentTags: GraphTag[],
}

export const LinkModuleNode: React.FC<ILinkModuleNode> = ({ setSource, sheetRef, setSheetOptions, setLinkOnChoice, setLinkSourceId, parentId, parentTags }) => {

    const questPrototype = useAppSelector(state => state.editor.questPrototype);
    const dispatch = useAppDispatch();

    const navigation = useNavigation();

    return (
        <View>
            <TouchableOpacity style={{borderRadius: 20}} onPress={() => {
                setSheetOptions([[I18n.t('createModuleBottomSheet'), 'puzzle-plus-outline', (
                    () => {
                        if (!questPrototype) {
                            console.log('What the fuck') // Actually no idea what this log represents but it's funny to keep it 
                            return;
                        }
                        // currently creates a single choice module. should route to create-module screen in future
                        const maxId = (_.max(questPrototype.modules.map(m => m.id)) || 0) + 1;

                        navigation.navigate('CreateModule', {
                            moduleId: maxId,
                            // TODO: Probably refactor ALL of this because react native does not support serializable functions... ugh
                            insertModuleId: () => {
                                dispatch(setModules(setSource(questPrototype, maxId).modules))
                            }
                        })
                    }
                )], [I18n.t('linkModuleChoice'), 'source-branch-plus',() => {
                    // setSource of this node will set its parents link variable (this is done in linksParser.ts)
                    // by setting the linkOnChoice reference to setSource, all future pressed nodes can access this nodes parent link
                    // if still in doubt, ask Lenny
                    // if you are Lenny, tough luck
                    setLinkSourceId(parentId)
                    setLinkOnChoice(() => (setSource))
                }

                ]])

                sheetRef.current?.snapTo(1)
            }}>
                <View>
                {parentTags.map((tag, idx) => <View key={idx} style={{...styles.component, height: 42, padding: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: -20}}>
                    <Text style={{textAlign: 'center', paddingHorizontal: 13}} ellipsizeMode={'tail'} numberOfLines={1}>{
                        tag.type === 'Choice' ? tag.choice 
                        : ((100*tag.probability).toPrecision(2) + '%')
                    }</Text>
                </View>)}
                <Text style={styles.component}>{I18n.t('addOrConnectModule')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    component: {
        width: 100,
        height: 100,
        padding: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        color: '#888',
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'dashed'
    }
})