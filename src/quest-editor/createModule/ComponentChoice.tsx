import React from 'react';
import { Text } from 'react-native';
import { QuestComponent } from '../../types/quest';


export interface IComponentChoice {
    components: QuestComponent[],
    setComponents: (arg0: QuestComponent[]) => void
}

export const ComponentChoice: React.FC<IComponentChoice> = ({ components, setComponents }) => {


    return (
        <Text>Test</Text>
    )

}