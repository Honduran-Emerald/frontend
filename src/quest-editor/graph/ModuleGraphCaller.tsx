import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Divider, Menu } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PrototypeModule, QuestPrototype } from '../../types/quest';
import { AddModuleNode } from './node-types/AddModuleNode';
import { LinkModuleNode as LinkModuleNode } from './node-types/LinkModuleNode';
import { parseModule } from './utils/linksParser';
import { ModuleGraph } from './ModuleGraph';
import { RegularModuleNode } from './node-types/RegularModuleNode';
import { fromLists } from './utils/sugiyama';
import BottomSheet from 'reanimated-bottom-sheet';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Graph } from 'graphlib';
import { addOrUpdateQuestModule } from '../../redux/editor/editorSlice';

export const ModuleGraphCaller = () => {

    const [positions, setPositions] = useState<string[][]>([]); // arrangement of single Nodes
    const [graph, setGraph] = useState<Graph>(); // includes list of edges. might be removed later

    // changes graph behavior if defined. Useful for linking where pressing a node should *not* open the module editor.
    const [linkOnChoice, setLinkOnChoice] = useState<((questPrototype: QuestPrototype, module_id: number) => PrototypeModule) | undefined>(undefined);
    const [linkSourceId, setLinkSourceId] = useState<string | number | undefined>(undefined);

    const questPrototype = useAppSelector((state) => state.editor.questPrototype); // redux selector

    const [sheetOptions, setSheetOptions] = useState<[string, string, (() => void)][]>([['hi', 'plus', (() => console.log(5))], ['hi there', 'plus', (() => console.log(6))]])
    const sheet = useRef<BottomSheet>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {

        if (!questPrototype) return () => {}; // if questPrototype isn't loaded yet, do nothing. 

        let { nodes, links } = parseModule(questPrototype) // calculate nodes and links
        let parentNodes: (string | number)[] = []
        if (linkSourceId !== undefined) {
            parentNodes = [linkSourceId]
            let oldLinkableNodes: (string | number)[] = []
            while (!parentNodes.every(v => oldLinkableNodes.includes(v))) {
                oldLinkableNodes = [...parentNodes]
                parentNodes = nodes.filter(n1 => parentNodes.includes(n1.id) 
                || undefined!==parentNodes.find(n2 => 
                    links.find(
                        l => l[1]===n2 
                          && l[0]===n1.id))).map(n => n.id)
            }
        }

        let { positions, graph } = fromLists(nodes.map(node => ({ // calculate virtual nodes for sugiyama layout
            id: node.id, component: 
            node.type === 'normal' 
            ? <RegularModuleNode node={node} linkOnChoice={linkOnChoice} setLinkOnChoice={setLinkOnChoice} linkable={!parentNodes.includes(node.id)} 
            setSheetOptions={setSheetOptions} sheetRef={sheet} 
            cutModule={() => node.setSources.forEach(setSource => dispatch(addOrUpdateQuestModule(setSource(questPrototype, null))))}/> // regular node. can be adjusted to return different types of nodes
            : <LinkModuleNode setSource={node.setSource} linkOnChoice={linkOnChoice} setLinkOnChoice={setLinkOnChoice} sheetRef={sheet} setSheetOptions={setSheetOptions} setLinkSourceId={setLinkSourceId} parentId={node.parentId}/> // empty node. clicking will allow to add a new or link to an existing module
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

    useEffect(() => {
        sheet.current?.snapTo(1)
    }, [ questPrototype ])

    return (
    <>
        <TouchableWithoutFeedback 
            onPressIn={() => {
                sheet.current?.snapTo(1);
            }}
            onPress={() => {
                setLinkOnChoice(undefined)
            }}
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
                    width: Dimensions.get('screen').width,
                    elevation: 10000, //tf does this even do??
                }}>
                {sheetOptions.map(
                        option => 
                        <View key={option[0]} 
                        style={{width: Dimensions.get('screen').width}}>
                            <Menu.Item 
                                title={option[0]} 
                                icon={option[1]} 
                                onPress={() => {sheet.current?.snapTo(1); option[2]()}}
                                style={{maxWidth: '90%', marginRight: 10}} // TODO: Make this responsive on all screens
                                />
                            <Divider/>
                        </View>
                )}
            </View>}/>
        </>
    )
}