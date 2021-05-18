import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import dagre from 'dagre';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Line, Path } from 'react-native-svg';
import { GraphModuleWrapper } from './GraphModuleWrapper';

const horizontalPadding = 50;
const verticalPadding = 100;
const ranksepBase = 10
const horizontalClampRatio = 0.6;

export interface IGraphModuleNode {
    id: string,
    component: React.ReactElement,
    width: number,
    height: number,
}
export interface IModuleGraph {
    nodes: IGraphModuleNode[],
    links: [string, string][],
    nodeWidth: number
}

export const ModuleGraph: React.FC<IModuleGraph> = ({ nodes, links, nodeWidth }) => {

    const [graph, setGraph] = useState<any>(undefined);

    const normalize = (x: number, minX: number, maxX: number, nodeWidth: number) => {
        if (maxX - minX > Dimensions.get('screen').width*horizontalClampRatio) {
            return (x - minX) * (Dimensions.get('screen').width - nodeWidth - horizontalPadding) / (maxX - minX) + horizontalPadding/2
        }
        return (x - minX) * (Dimensions.get('screen').width*horizontalClampRatio - nodeWidth) / (maxX - minX) + (Dimensions.get('screen').width/2 - (Dimensions.get('screen').width*horizontalClampRatio - nodeWidth)/2 - nodeWidth/2)
    }

    const ranksep = Math.max(...nodes.map(node => node.height)) + ranksepBase

    const viewHeight = graph ? verticalPadding + Math.max(...graph.nodes().map((node: any) => (
        graph.node(node).y + graph.node(node).n_height
    ))) : 0;

    const maxX = graph ? Math.max(...graph.nodes().map((node: any) => graph.node(node).x)) : 0
    const minX = graph ? Math.min(...graph.nodes().map((node: any) => graph.node(node).x)) : 0
    

    useEffect(() => {
        
        var g = new dagre.graphlib.Graph().setGraph({
            ranksep: ranksep
        });
        
        g.setDefaultEdgeLabel(function() { return {}; });

        nodes.forEach(node => g.setNode(node.id, {
            component: node.component,
            width: node.width,
            n_height: node.height
        }))

        links.forEach(link => g.setEdge(link[0], link[1]))

        dagre.layout(g)

        setGraph(g)

    }, [nodes, links, nodeWidth])
    
    return (
        <ScrollView>
            <View style={{height: viewHeight}} >
                <Svg 
                    height="100%" 
                    width="100%" 
                    viewBox={"0 0 "+Dimensions.get('screen').width+" "+viewHeight}

                    >
                    <Line x1={0} x2={Dimensions.get('screen').width} y1={0} y2={viewHeight} opacity='0.2' stroke='red'/>
                    <Line x2={0} x1={Dimensions.get('screen').width} y1={0} y2={viewHeight} opacity='0.2' stroke='red'/>
                    {graph && graph.edges().map((edge: any, idx: number) => {

                        const nX = (x: number) => (normalize(x, minX, maxX, nodeWidth) + nodeWidth/2)
                        const nY = (y: number, node: any) => (y + verticalPadding/2 + graph.node(node).n_height/2)

                        const points = graph.edge(edge).points;

                        const path = ['M', nX(points[0].x), nY(points[0].y, edge.v)]
                        for (var i = 1; i < points.length; i=i+2) {
                            path.push('Q', nX(points[i].x), nY(points[i].y, edge.v), nX(points[i+1].x), nY(points[i+1].y, edge.v));
                        }

                        return (
                            <Path
                                key={idx}
                                d={path.join(' ')}
                                stroke='black'   
                                strokeWidth='1'
                            />
                        )
                    })}
                </Svg>
            </View>
            {graph && graph.nodes().map((node: any) => {
                const ne = graph.node(node);
                return (
                    <GraphModuleWrapper 
                        key={node} 
                        component={ne.component} 
                        x={normalize(ne.x, minX, maxX, nodeWidth)} 
                        y={ne.y + verticalPadding/2}
                        width={ne.width}
                        height={ne.n_height}/>
                )
                })} 
        </ScrollView>
    );
}
