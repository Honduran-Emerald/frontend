import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Provider } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../types/quest';
import { AddModuleNode } from './AddModuleNode';
import { LinkModuleNode as LinkModuleNode } from './LinkModuleNode';
import { graph_connections } from './linksParser';
import { ModuleGraph } from './ModuleGraph';
import { ModuleNode } from './ModuleNode';
import { fromLists } from './sugiyama';

export const ModuleGraphCaller = () => {

    const [positions, setPositions] = useState<string[][]>([]); // arrangement of single Nodes
    const [graph, setGraph] = useState<dagre.graphlib.Graph<{}>>(); // includes list of edges. might be removed later

    // changes graph behavior if defined. Useful for linking where pressing a node should *not* open the module editor.
    const linkOnChoice = useRef<((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined>(undefined) 

    const questPrototype = useAppSelector((state) => state.editor.questPrototype); // redux selector

    useEffect(() => {

        if (!questPrototype) return () => {}; // if questPrototype isn't loaded yet, do nothing. 

        let { nodes, links } = graph_connections(questPrototype) // calculate nodes and links
        let { positions, graph } = fromLists(nodes.map(node => ({ // calculate virtual nodes for sugiyama layout
            id: node.id, component: 
            node.type === 'normal' 
            ? <ModuleNode node={node} linkOnChoice={linkOnChoice} /> // regular node. can be adjusted to return different types of nodes
            : <LinkModuleNode setSource={node.setSource} linkOnChoice={linkOnChoice}/> // empty node. clicking will allow to add a new or link to an existing module
        })), links);

        if (positions.length > 0) {
            setPositions(positions);
            setGraph(graph);
        } else {
            let { positions, graph } = fromLists([{
                id: 0,
                component: <AddModuleNode setSource={(a,b) => a.modules[0]} linkOnChoice={linkOnChoice}/>
            }], [])
            setPositions(positions);
            setGraph(graph);
        }

        
    }, [questPrototype, linkOnChoice])

    return (
    <Provider>
        <ModuleGraph 
            positions={positions}
            graph={graph}/>
    </Provider>)
}