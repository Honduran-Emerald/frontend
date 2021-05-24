import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { loadQuest } from '../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createQueryRequest } from '../utils/requestHandler';

export const QuestEditor = () => {

    const questDeep = useAppSelector((state) => state.editor.questDeep)
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
        </View>
    )
}