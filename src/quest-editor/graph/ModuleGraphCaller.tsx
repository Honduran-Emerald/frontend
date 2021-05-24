import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ModuleGraph } from './ModuleGraph';
import { fromLists } from './sugiyama';

const nodeSize = 60;

export const ModuleGraphCaller = () => {

    const [positions, setPositions] = useState<string[][]>([])

    const [graph, setGraph] = useState<dagre.graphlib.Graph<{}>>();
    

    useEffect(() => {
        let nodes = ([
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

            'a1',
            'a2'
            
        ]);

        let links = ([
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


            ['p1', 'p7'],
            ['p1', 'p8'],
            ['p1', 'p9'],
            ['p7', 'p6'],
            ['p8', 'p6'],
            ['p9', 'p6'],
            
            ['p5', 'p6'],

            ['a1', 'a2'],
            ['a2', 'n4']
        ])

        const { positions, graph } = fromLists(nodes.map(node => ({ 
            id: node, component: 
            <Text style={styles.textcomponent}>{node}</Text>
        })), links);

        setPositions(positions);
        setGraph(graph)


    }, [])

    return (<ModuleGraph 
        positions={positions}
        graph={graph}
    />)
}

export const IncComp = ({t} : {t: string}) => {
    <Text style={styles.textcomponent} >{t}</Text>
}

const styles = StyleSheet.create({
    textcomponent: {
        width: 70,
        height: 60,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1
    }
})