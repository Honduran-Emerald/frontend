import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ModuleGraph, IGraphModuleNode } from './ModuleGraph';

const nodeSize = 60;

export const ModuleGraphCaller = () => {

    const [nodes, setNodes] = useState<string[]>([])

    const [links, setLinks] = useState<[string, string][]>([])
    

    useEffect(() => {
        setNodes([
            'n1',
            'n2',
            'n3',
            'n4',
            'n5',
            'n6',
            'p1',
            'p2',
            'p3',
            'p4',
            'p5',
            'p6',
            'p7',
            'p8',
            'p9',
            'p10',
        ]);

        setLinks([
            ['n1', 'n2'],
            ['n2', 'n3'],
            ['n2', 'n4'],
            ['n3', 'n5'],
            ['n3', 'n4'],
            ['n4', 'n5'],
            ['n4', 'n6'],
            ['n6', 'p1'],
        
            ['p1', 'p2'],
            ['p1', 'p3'],
            ['p1', 'p4'],
            ['p1', 'p5'],
            ['p2', 'p6'],
            ['p3', 'p6'],
            ['p4', 'p6'],
            ['p7', 'p6'],
            ['p8', 'p6'],
            ['p9', 'p6'],
            ['p10', 'p6'],
            
            ['p5', 'p6'],
        ])
    }, [])

    return (<ModuleGraph 
        nodes={nodes.map(node => ({ 
            id: node, component: 
            <Text style={styles.textcomponent} 
                onPress={() => {
                    setNodes(nodes.concat('x' + (nodes.length-1)));
                    setLinks(links.concat([[node, 'x' + (nodes.length-1)]]))
                }}>{node}</Text>
           , width: nodeSize, height: nodeSize
        }))}
        links={links}
        nodeWidth={60}
    />)
}

export const IncComp = ({t} : {t: string}) => {
    <Text style={styles.textcomponent} >{t}</Text>
}

const styles = StyleSheet.create({
    textcomponent: {
        //width: nodeSize,
        //height: nodeSize
    }
})