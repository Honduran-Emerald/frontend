import React from 'react';
import { Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { ModuleGraph } from './graph/ModuleGraph';

export const QuestEditor = () => {

    const questDeep = useAppSelector((state) => state.editor.questDeep)
    const dispatch = useAppDispatch()

    return (
        questDeep===undefined 
            ? <Text>Loading...</Text> 
            : <ModuleGraph 
                nodes={questDeep.modules.map(m => ({
                    id: m.moduleId,
                    height: 70,
                    component: <Text>{m.type}</Text>
                }))}
                links={questDeep.modules.map(m => m.links
                            .map((l: number): [number, number] => ([m.moduleId, l]))
                    ).reduce((prev, current) => prev.concat(current))}
                nodeWidth={70}/>
    )
}