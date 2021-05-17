import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import dagre from 'dagre';
import { ScrollView } from 'react-native-gesture-handler';

const horizontalPadding = 50;
const verticalPadding = 100;
const nodeSize = 60;
const ranksep = nodeSize + 40;
const horizontalClampRatio = 0.6;

const nodes = [
    { id: 'n1', label: 'n1', width: nodeSize, height: nodeSize},
    { id: 'n2', label: 'n2', width: nodeSize, height: nodeSize},
    { id: 'n3', label: 'n3', width: nodeSize, height: nodeSize},
    { id: 'n4', label: 'n4', width: nodeSize, height: nodeSize},
    { id: 'n5', label: 'n5', width: nodeSize, height: nodeSize},
    { id: 'n6', label: 'n6', width: nodeSize, height: nodeSize},
]

const links = [
    ['n1', 'n2'],
    ['n2', 'n3'],
    ['n2', 'n4'],
    ['n3', 'n5'],
    ['n3', 'n4'],
    ['n4', 'n5'],
    ['n4', 'n6'],
    ['n5', 'n6'],
]

const normalize = (x: number, minX: number, maxX: number) => {
    if (maxX - minX > Dimensions.get('screen').width*horizontalClampRatio) {
        return (x - minX) * (Dimensions.get('screen').width - nodeSize - horizontalPadding) / (maxX - minX) + horizontalPadding/2
    }
    return (x - minX) * (Dimensions.get('screen').width*horizontalClampRatio - nodeSize) / (maxX - minX) + (Dimensions.get('screen').width/2 - (Dimensions.get('screen').width*horizontalClampRatio - nodeSize)/2 - nodeSize/2)
}

export const ModuleGraph: React.FC = () => {

    const [graph, setGraph] = useState<any>(undefined);
    
    const [minX, setMinX] = useState(0);
    const [maxX, setMaxX] = useState(0);
    const [maxY, setMaxY] = useState(0);

    useEffect(() => {
        
        var g = new dagre.graphlib.Graph().setGraph({
            rankdir: 'TB',
            ranksep: ranksep
        });
        
        g.setDefaultEdgeLabel(function() { return {}; });
        
        nodes.forEach(node => g.setNode(node.id, {
            label: node.label,
            width: node.width,
            heigth: node.height
        }))

        links.forEach(link => g.setEdge(link[0], link[1]))

        dagre.layout(g)

        setMaxX(Math.max(...g.nodes().map((node: any) => g.node(node).x)))
        setMinX(Math.min(...g.nodes().map((node: any) => g.node(node).x)))
        setMaxY(Math.max(...g.nodes().map((node: any) => g.node(node).y)))

        setGraph(g)

    }, [])
    
    return (
        <ScrollView>
            <View style={{height: maxY+nodeSize+verticalPadding}} />
            {graph && graph.nodes().map((node: any) => {
                const ne = graph.node(node);
                return (
                    <SingleModule 
                        key={node} 
                        title={ne.label} 
                        x={normalize(ne.x, minX, maxX)} 
                        y={ne.y + verticalPadding/2}/>
                )
                })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {

    },
})

interface ISingleModule {
    title: string,
    x: number,
    y: number
}

const SingleModule: React.FC<ISingleModule> = ({ title, x, y }) => (
    <View style={{
        borderWidth: 1,
        width: nodeSize,
        height: nodeSize,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: x,
        top: y,
        borderRadius: 20
    
        }}>
        <Text>
            {title}
        </Text>
    </View>
)