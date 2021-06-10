import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Divider, Menu, Provider } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../types/quest';
import { AddModuleNode } from './AddModuleNode';
import { LinkModuleNode as LinkModuleNode } from './LinkModuleNode';
import { graph_connections } from './linksParser';
import { ModuleGraph } from './ModuleGraph';
import { ModuleNode } from './ModuleNode';
import { fromLists } from './sugiyama';
import BottomSheet from 'reanimated-bottom-sheet';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

export const ModuleGraphCaller = () => {

    const [positions, setPositions] = useState<string[][]>([]); // arrangement of single Nodes
    const [graph, setGraph] = useState<dagre.graphlib.Graph<{}>>(); // includes list of edges. might be removed later

    // changes graph behavior if defined. Useful for linking where pressing a node should *not* open the module editor.
    const linkOnChoice = useRef<((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined>(undefined) 

    const questPrototype = useAppSelector((state) => state.editor.questPrototype); // redux selector

    const [sheetOptions, setSheetOptions] = useState<[string, string, (() => void)][]>([['hi', 'plus', (() => console.log(5))], ['hi there', 'plus', (() => console.log(6))]])
    const sheet = useRef<BottomSheet>(null);

    useEffect(() => {

        sheet.current?.snapTo(1)

        if (!questPrototype) return () => {}; // if questPrototype isn't loaded yet, do nothing. 

        let { nodes, links } = graph_connections(questPrototype) // calculate nodes and links
        let { positions, graph } = fromLists(nodes.map(node => ({ // calculate virtual nodes for sugiyama layout
            id: node.id, component: 
            node.type === 'normal' 
            ? <ModuleNode node={node} linkOnChoice={linkOnChoice} /> // regular node. can be adjusted to return different types of nodes
            : <LinkModuleNode setSource={node.setSource} linkOnChoice={linkOnChoice} sheetRef={sheet} setSheetOptions={setSheetOptions}/> // empty node. clicking will allow to add a new or link to an existing module
        })), links);

        if (positions.length > 0) {
            setPositions(positions);
            setGraph(graph);
        } else {
            let { positions, graph } = fromLists([{
                id: 0,
                component: <AddModuleNode setSource={(a,b) => a.modules[0]} linkOnChoice={linkOnChoice} sheetRef={sheet} setSheetOptions={setSheetOptions}/>
            }], [])
            setPositions(positions);
            setGraph(graph);
        }

        
    }, [questPrototype, linkOnChoice])

    return (
    <Provider>
        <TouchableWithoutFeedback 
            onPressIn={() => sheet.current?.snapTo(1)}
            style={{
                minHeight: '100%'
            }}>

            <ModuleGraph 
                positions={positions}
                graph={graph}/>
        </TouchableWithoutFeedback>
        <BottomSheet
            ref={sheet}
            borderRadius={40}
            snapPoints={[150, 0]}
            initialSnap={1}
            enabledContentTapInteraction={false}

            renderContent={() => 
            <View 
                style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    height: '100%',
                    padding: 20,
                    elevation: 10000, //td does this even do??
                }}>
                {sheetOptions.map(
                        option => 
                        <View key={option[0]} 
                        style={{width: Dimensions.get('screen').width}}>
                            <Menu.Item title={option[0]} icon={option[1]} onPress={option[2]}/>
                            <Divider/>
                        </View>
                )}
            </View>}/>

    </Provider>)
}