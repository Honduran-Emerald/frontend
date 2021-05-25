import React from 'react';
import { QuestComponent } from '../../types/quest';


export interface IComponentChoice {
    components: QuestComponent[],
    setComponents: (arg0: QuestComponent[]) => void
}

export const ComponentChoice: React.FC<IComponentChoice> = ({ components, setComponents }) => {


    return (
        
    )

}