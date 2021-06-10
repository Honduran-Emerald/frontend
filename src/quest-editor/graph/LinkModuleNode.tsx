import React, { MutableRefObject, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Modal, Portal, Text, TouchableRipple, Provider, Button, Divider } from 'react-native-paper';
import { addOrUpdateQuestModule } from '../../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../types/quest';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/core';
import I18n from 'i18n-js';
import { Colors } from '../../styles';
import BottomSheet from 'reanimated-bottom-sheet';

interface ILinkModuleNode {
    setSource: (questPrototype: QuestPrototype, moduleId: number) => PrototypeModule,
    linkOnChoice: MutableRefObject<((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined>,
    sheetRef: React.RefObject<BottomSheet>,
    setSheetOptions: React.Dispatch<React.SetStateAction<[string, string, () => void][]>>
}

export const LinkModuleNode: React.FC<ILinkModuleNode> = ({ setSource, linkOnChoice, sheetRef, setSheetOptions }) => {

    const questPrototype = useAppSelector(state => state.editor.questPrototype);
    const dispatch = useAppDispatch();

    const navigation = useNavigation();

    const [modalOpen, setModalOpen] = useState(false); // Modal for choosing whether to add a module or to link to an existing module

    return (
        <View>
            <Portal>
                {/* TODO: Change this interface. It looks like trash */}
                <Modal visible={modalOpen} onDismiss={() => {setModalOpen(false)} }>
                    <Button mode='contained' theme={{colors: {primary: Colors.primary}}} onPress={() => {
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
                                dispatch(addOrUpdateQuestModule(setSource(questPrototype, maxId)))
                            }
                        })
                       
                        setModalOpen(false);
                    }}>
                        {I18n.t('createModuleChoice')}
                    </Button>
                    <Divider/>
                    <Button mode='contained' theme={{colors: {primary: Colors.primary}}} onPress={() => {
                        // setSource of this node will set its parents link variable (this is done in linksParser.ts)
                        // by setting the linkOnChoice reference to setSource, all future pressed nodes can access this nodes parent link
                        // if still in doubt, ask Lenny
                        // if you are Lenny, tough luck
                        linkOnChoice.current = setSource;
                        setModalOpen(false);
                    }}>
                        {I18n.t('linkModuleChoice')}
                    </Button>
                    
                </Modal>
            </Portal> 
            <TouchableHighlight style={{borderRadius: 20}} onPress={() => {
                //setModalOpen(true);
                setSheetOptions([[I18n.t('createModuleButton'), 'puzzle-plus-outline', (
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
                                dispatch(addOrUpdateQuestModule(setSource(questPrototype, maxId)))
                            }
                        })
                    }
                )], [I18n.t('linkModuleChoice'), 'source-branch-plus',() => {
                    // setSource of this node will set its parents link variable (this is done in linksParser.ts)
                    // by setting the linkOnChoice reference to setSource, all future pressed nodes can access this nodes parent link
                    // if still in doubt, ask Lenny
                    // if you are Lenny, tough luck
                    linkOnChoice.current = setSource;
                    setModalOpen(false);
                }

                ]])
                sheetRef.current?.snapTo(0)
            }}>
                <Text style={styles.component}>{I18n.t('addOrConnectModule')}</Text>

            </TouchableHighlight>
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