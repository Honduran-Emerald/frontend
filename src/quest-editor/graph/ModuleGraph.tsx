import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import dagre from 'dagre';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Line, Path } from 'react-native-svg';

const bezierOffset = 80;
const rowMargin = 40;
const contentHorizontalMargin = 10;
const virtualHorizontalMargin = 10;

export interface IGraphModuleNode {
    id: number | string,
    component: React.ReactElement,
}
export interface IModuleGraph {
    graph: dagre.graphlib.Graph<{}>,
    positions: string[][]
}

export const ModuleGraph: React.FC<IModuleGraph> = ({ graph, positions}) => {

    const [posMap, setPosMap] = useState<{[id: string]: {x: number, y: number}}>();
    const [svgHeight, setSvgHeight] = useState(0);
    const [outerNodeOffset, setOuterNodeOffset] = useState<{[indices: string]: {x: number, y: number}}>({});
    const [outerHorizontalScrollOffset, setOuterHorizontalScrollOffset] = useState<{x: number, y: number}[]>([])
    const [innerHorizontalScrollOffset, setInnerHorizontalScrollOffset] = useState<number[]>([]);
    const [indexPath, setIndexPath] = useState<{v: {rowIdx: number, columnIdx: number}, w: {rowIdx: number, columnIdx: number}}[]>([]);


    useEffect(() => {
        setIndexPath(graph ? graph.edges()
        .map(e => {
            let lineIdx = positions.findIndex((line) => line.includes(e.v));
            return ({
                v: {
                    rowIdx: lineIdx,
                    columnIdx: positions[lineIdx].findIndex(n => n === e.v)
                },
                w: {
                    rowIdx: lineIdx + 1,
                    columnIdx: positions[lineIdx + 1].findIndex(n => n === e.w)
                },
            })
        
        }) : []);
    }, [graph, positions])

    const s = {
        margin: 0
    }

    return (
        (positions.length > 0) ?
        <ScrollView style={{height: 1000}}>
            
            <View style={{position: 'absolute'}}>
                 <View>
                    <Svg
                        height={svgHeight}
                        width={Dimensions.get('screen').width}>

                    <Line x1={0} x2={Dimensions.get('screen').width} y1={0} y2='100%' opacity='0.2' stroke='red'/>
                    <Line x2={0} x1={Dimensions.get('screen').width} y1={0} y2='100%' opacity='0.2' stroke='red'/>

                    {indexPath.map(edge => (<Path 
                        key={[edge.v.columnIdx, edge.v.rowIdx, edge.w.columnIdx, edge.w.rowIdx].join('|')}
                        d={`M ${
                            (outerHorizontalScrollOffset[edge.v.rowIdx]?.x || 0) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.v.rowIdx] || 0)
                        } ${
                            (outerHorizontalScrollOffset[edge.v.rowIdx]?.y || 0) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.y || 0)
                        } C ${
                            (outerHorizontalScrollOffset[edge.v.rowIdx]?.x || 0) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.v.rowIdx] || 0)
                        } ${
                            (outerHorizontalScrollOffset[edge.v.rowIdx]?.y || 0) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.y || 0) + bezierOffset
                        } ${
                            (outerHorizontalScrollOffset[edge.w.rowIdx]?.x || 0) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.w.rowIdx] || 0)
                        } ${
                            (outerHorizontalScrollOffset[edge.w.rowIdx]?.y || 0) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.y || 0) - bezierOffset
                        } ${
                            (outerHorizontalScrollOffset[edge.w.rowIdx]?.x || 0) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.w.rowIdx] || 0)
                        } ${
                            (outerHorizontalScrollOffset[edge.w.rowIdx]?.y || 0) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.y || 0)
                        }`}
                        stroke='black'
                        strokeWidth='1'
                    />))}
                    </Svg>
                </View>
                    </View>
            
            <View onLayout={(event) => setSvgHeight(event.nativeEvent.layout.height)}> 
                {positions.map((posLine, rowId) => (
                    <ScrollView 
                        key={rowId} 
                        horizontal={true} 
                        style={{marginTop: rowMargin, alignSelf: 'center'}}
                        onLayout={(event) => {
                            const c = outerHorizontalScrollOffset.slice()
                            c[rowId] = {
                                x: event.nativeEvent.layout.x,
                                y: event.nativeEvent.layout.y
                            }
                            setOuterHorizontalScrollOffset(c)
                            }}
                        onScroll={(event) => {
                            const c = innerHorizontalScrollOffset.slice()
                            c[rowId] = event.nativeEvent.contentOffset.x
                            setInnerHorizontalScrollOffset(c)
                        }}
                        showsHorizontalScrollIndicator={false}>
                    
                    {//@ts-ignore
                    posLine.map((element, columnId) => {
                        const ne = graph.node(element);

                        if (ne === undefined) {
                            return (
                                <View 
                                    key={element} 
                                    onLayout={(event) => {
                                        var {x, y, width, height} = event.nativeEvent.layout;
                                        setPosMap({...posMap, [element]: {x: x+width/2, y: y+height/2}})
                                        setOuterNodeOffset({...outerNodeOffset, [[rowId, columnId].join('|')]: {x: x+width/2, y: y+height/2} })
                                    }}
                                    style={{marginHorizontal: virtualHorizontalMargin}}>

                                </View>
                            )
                        }

                        return (
                            <View key={element} style={{
                                marginHorizontal: contentHorizontalMargin
                            }} onLayout={(event) => {
                                var {x, y, width, height} = event.nativeEvent.layout;
                                setPosMap({...posMap, [element]: {x: x+width/2, y: y+height/2}})
                                setOuterNodeOffset({...outerNodeOffset, [[rowId, columnId].join('|')]: {x: x+width/2, y: y+height/2} })
                            }}>
                                {//@ts-ignore
                                ne.component}
                            </View>
                        )
                    })}
                </ScrollView>
            ))}
            </View>
            
        </ScrollView> : <Text>Loading Graph...</Text>
    );
}
