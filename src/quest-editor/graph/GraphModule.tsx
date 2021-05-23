import React from 'react';
import { Text, View } from "react-native";

interface IGraphModule {
    title: string,
    x: number,
    y: number,
    nodeSize: number
}

export const GraphModule: React.FC<IGraphModule> = ({ title, x, y, nodeSize }) => (
    <View style={{
        borderWidth: 1,
        width: nodeSize,
        height: nodeSize,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: x,
        top: y,
        borderRadius: 20,
        backgroundColor: 'white'
    
        }}>
        <Text>
            {title}
        </Text>
    </View>
)