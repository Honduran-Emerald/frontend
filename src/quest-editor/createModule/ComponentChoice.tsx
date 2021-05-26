import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { QuestComponent } from '../../types/quest';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface IComponentChoice {
    components: QuestComponent[],
    setComponents: (arg0: QuestComponent[]) => void
}


export const ComponentChoice: React.FC<IComponentChoice> = ({ components, setComponents }) => {


    return (
        <Text>Test</Text>
    )

}