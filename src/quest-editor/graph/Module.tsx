import React from 'react';
import { Text } from 'react-native';


interface IModule {
    name: string
}

export const Module: React.FC<IModule> = ({ name }) => (
    <Text>
        {name}
    </Text>
)