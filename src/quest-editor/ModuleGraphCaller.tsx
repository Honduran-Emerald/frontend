import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ModuleGraph, IGraphModuleNode } from './ModuleGraph';

const nodeSize = 60;

export const ModuleGraphCaller = () => {


    const nodes: IGraphModuleNode[] = [
        { id: 'n1', component: <Text style={styles.textcomponent}>n1142</Text>, width: nodeSize, height: nodeSize},
        { id: 'n2', component: <Text style={styles.textcomponent}>n2</Text>, width: nodeSize, height: nodeSize},
        { id: 'n3', component: <Text style={styles.textcomponent}>n3</Text>, width: nodeSize, height: nodeSize},
        { id: 'n4', component: <Text style={styles.textcomponent}>n4</Text>, width: nodeSize, height: nodeSize},
        { id: 'n5', component: <Text style={styles.textcomponent}>n5</Text>, width: nodeSize, height: nodeSize},
        { id: 'n6', component: <Text style={styles.textcomponent}>n6</Text>, width: nodeSize, height: nodeSize},
        { id: 'p1', component: <Text style={styles.textcomponent}>p1</Text>, width: nodeSize, height: nodeSize},
        { id: 'p2', component: <Text style={styles.textcomponent}>p2</Text>, width: nodeSize, height: nodeSize},
        { id: 'p3', component: <Text style={styles.textcomponent}>p3</Text>, width: nodeSize, height: nodeSize},
        { id: 'p4', component: <Text style={styles.textcomponent}>p4</Text>, width: nodeSize, height: nodeSize},
        { id: 'p5', component: <Text style={styles.textcomponent}>p5</Text>, width: nodeSize, height: nodeSize},
        { id: 'p6', component: <Text style={styles.textcomponent}>p6</Text>, width: nodeSize, height: nodeSize},
    ]

    const links: [string, string][] = [
        ['n1', 'n2'],
        ['n2', 'n3'],
        ['n2', 'n4'],
        ['n3', 'n5'],
        ['n3', 'n4'],
        ['n4', 'n5'],
        ['n4', 'n6'],
        //['n5', 'n6'],
    
        ['n6', 'p1'],
    
        ['p1', 'p2'],
        ['p1', 'p3'],
        ['p1', 'p4'],
        ['p1', 'p5'],
        ['p2', 'p6'],
        ['p3', 'p6'],
        ['p4', 'p6'],
        ['p5', 'p6'],
    
    ]

    return (<ModuleGraph 
        nodes={nodes}
        links={links}
        nodeWidth={60}
    />)
}

const styles = StyleSheet.create({
    textcomponent: {
        //width: nodeSize,
        //height: nodeSize
    }
})