import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { PrototypeComponent } from '../../types/quest';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface IComponentChoice {
    components: PrototypeComponent[],
    setComponents: (arg0: PrototypeComponent[]) => void
}


export const ComponentChoice: React.FC<IComponentChoice> = ({ components, setComponents }) => {


    return (
        <Text>Test</Text>
    )

}