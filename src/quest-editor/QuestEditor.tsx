import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Text, View, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const QuestEditor = () => {

    const questDeep = useAppSelector((state) => state.editor)
    const dispatch = useAppDispatch()

    const navigation = useNavigation()

    return (
        <View>
            <Text>
                {JSON.stringify(questDeep)}
            </Text>
            <Button onPress={() => {navigation.navigate('Questlog', {
                questId: '60a403afaf6922a6f2aa21e8'
            })}} title='Load other'/>
            <Button onPress={() => {navigation.navigate('ModuleGraph')}} title='Load graph'/>
            <Button onPress={() => {navigation.navigate('SvgDemo')}} title='Load SvgDemo'/>
            <Button onPress={() => {navigation.navigate('CreateModule')}} title='Create Module'/>
            <Button onPress={() => {navigation.navigate('ModulesList')}} title='List Module'/>
        </View>
    )
}