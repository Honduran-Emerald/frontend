import React from 'react';
import { View } from "react-native";

interface IGraphModuleWrapper {
    x: number,
    y: number,
    width: number,
    height: number,
    component: React.ComponentType
}

export const GraphModuleWrapper: React.FC<IGraphModuleWrapper> = ({ component, x, y, width, height }) => (
    <View style={{
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        borderRadius: 20,
        backgroundColor: 'white'
    
        }}>
        {component}
    </View>
)
