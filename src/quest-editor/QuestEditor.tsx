import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Text, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const QuestEditor = () => {

    const questEditor = useAppSelector((state) => state.editor)
    const dispatch = useAppDispatch()

    const navigation = useNavigation()

    return (
        <ScrollView style={{marginBottom: 20}}>
            <Text>
                {JSON.stringify(questEditor.questPrototype)}
            </Text>
            <Button onPress={() => {navigation.navigate('Questlog', {
                questId: '60b4f09cd81fb234791b98ec'
            })}} title='Load other'/>
            <Button onPress={() => {navigation.navigate('SvgDemo')}} title='Load SvgDemo'/>
            <Button onPress={() => {navigation.navigate('CreateModule')}} title='Create Module'/>
            <Button onPress={() => {navigation.navigate('ModulesList')}} title='List Module'/>
            <Button onPress={() => {navigation.navigate('ModuleGraph')}} title='True Graph'/>
        </ScrollView>
    )
}