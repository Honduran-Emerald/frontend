import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import dagre from 'dagre';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { G, Path } from 'react-native-svg';
import _ from 'lodash';
import Animated, {  useAnimatedStyle, useValue } from 'react-native-reanimated';
import { Button } from 'react-native-paper';

const bezierOffset = 80;
const rowMargin = 40;
const contentHorizontalMargin = 10;
const virtualHorizontalMargin = 10;

const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface IGraphModuleNode {
    id: number | string,
    component: React.ReactElement,
}
export interface IModuleGraph {
    graph: dagre.graphlib.Graph<{}> | undefined,
    positions: string[][]
}

export const ModuleGraph: React.FC<IModuleGraph> = ({ graph, positions}) => {

    const [posMap, setPosMap] = useState<{[id: string]: {x: number, y: number}}>();
    const [outerNodeOffset, setOuterNodeOffset] = useState<{[indices: string]: {x: number, y: number}}>({});
    const [outerHorizontalScrollOffset, setOuterHorizontalScrollOffset] = useState<{x: number, y: number}[]>([])
    const [innerHorizontalScrollOffset, setInnerHorizontalScrollOffset] = useState<number[]>([]);
    const [indexPath, setIndexPath] = useState<{v: {rowIdx: number, columnIdx: number}, w: {rowIdx: number, columnIdx: number}}[]>([]);

    const svgPath = useValue<string>('M 0 0')
    const scrollY = useValue<number>(0)

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

    if (indexPath.find(edge => outerHorizontalScrollOffset[edge.v.rowIdx] === undefined
                                || outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')] === undefined
                                || outerHorizontalScrollOffset[edge.w.rowIdx] === undefined
                                || outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')] === undefined)) {
    }

    const val = indexPath.map(edge => (`M ${
        (outerHorizontalScrollOffset[edge.v.rowIdx]?.x || 0) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.v.rowIdx] || 0)
    } ${
        (outerHorizontalScrollOffset[edge.v.rowIdx]?.y || NaN) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.y || NaN)
    } C ${
        (outerHorizontalScrollOffset[edge.v.rowIdx]?.x || 0) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.v.rowIdx] || 0)
    } ${
        (outerHorizontalScrollOffset[edge.v.rowIdx]?.y || NaN) + (outerNodeOffset[[edge.v.rowIdx, edge.v.columnIdx].join('|')]?.y || NaN) + bezierOffset
    } ${
        (outerHorizontalScrollOffset[edge.w.rowIdx]?.x || 0) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.w.rowIdx] || 0)
    } ${
        (outerHorizontalScrollOffset[edge.w.rowIdx]?.y || NaN) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.y || NaN) - bezierOffset
    } ${
        (outerHorizontalScrollOffset[edge.w.rowIdx]?.x || 0) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.x || 0) - (innerHorizontalScrollOffset[edge.w.rowIdx] || 0)
    } ${
        (outerHorizontalScrollOffset[edge.w.rowIdx]?.y || NaN) + (outerNodeOffset[[edge.w.rowIdx, edge.w.columnIdx].join('|')]?.y || NaN)
    }`)).join(' ')

    svgPath.setValue(val)

    return (
        <View>
             <View style={{position: 'absolute'}}>
                <Svg
                    height={Dimensions.get('screen').height}
                    width={Dimensions.get('screen').width}
                    >
                        
                    <AnimatedG
                    {...{/* So somehow the "style" prop just fucking disappears. God knows why
                    //@ts-ignore */}}
                        style={{ 
                            transform: [
                                {translateY: Animated.multiply(-1, scrollY)}
                            ]
                        }}>
                        <AnimatedPath d={svgPath} 
                        strokeWidth='1'
                        stroke='black'
                        />    
                    </AnimatedG>  

                </Svg>
            </View>
            {
            (positions.length > 0 && graph) ?
                <Animated.ScrollView 
                    scrollEventThrottle={1}
                    onScroll={// This updates the animated scroll value. Not sure why, but it's 100% smoother than using component state
                        Animated.event(
                            [{nativeEvent: {contentOffset: {y: scrollY}}}],
                            { 
                                listener: (event: any) => {console.log('hello')},
                                useNativeDriver: true // Internet said this will improve performance. Not sure whether it does
                            } 
                        )
                    }
                >

                    <View 
                        style={{marginBottom: 50}}> 
                        {positions.map((posLine, rowId) => (
                            <ScrollView 
                                key={rowId} 
                                horizontal={true} 
                                style={{marginTop: rowMargin, alignSelf: 'center'}}
                                contentContainerStyle={{justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                                onLayout={(event) => {
                                    const c = outerHorizontalScrollOffset.slice()
                                    c[rowId] = {
                                        x: event.nativeEvent.layout.x,
                                        y: event.nativeEvent.layout.y
                                    }
                                    setOuterHorizontalScrollOffset(c)
                                    }}
                                scrollEventThrottle={1}
                                onScroll={
                                    (event) => {
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
                    
                </Animated.ScrollView > : <Text>Loading Graph...</Text>
            }
        </View>
    );
}
