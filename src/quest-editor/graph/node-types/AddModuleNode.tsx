import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { useAppSelector } from '../../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../../types/quest';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/core';
import I18n from 'i18n-js';
import BottomSheet from 'reanimated-bottom-sheet';

interface IAddModuleNode {
    setSource: (questPrototype: QuestPrototype, moduleId: number) => PrototypeModule,
    linkOnChoice: ((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined,
    sheetRef: React.RefObject<BottomSheet>,
    setSheetOptions: React.Dispatch<React.SetStateAction<[string, string, () => void][]>>
}

export const AddModuleNode: React.FC<IAddModuleNode> = ({ sheetRef, setSheetOptions }) => {

    const questPrototype = useAppSelector(state => state.editor.questPrototype);

    const navigation = useNavigation();

    return (
        <View>
            <TouchableHighlight style={{borderRadius: 20}} onPress={() => {

                setSheetOptions([[I18n.t('createModuleBottomSheet'), 'plus', (
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
                            insertModuleId: () => {}
                        })
                    }
                )]])
                sheetRef.current?.snapTo(0)
            }}>
                <Text style={styles.component}>{I18n.t('addModule')}</Text>

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