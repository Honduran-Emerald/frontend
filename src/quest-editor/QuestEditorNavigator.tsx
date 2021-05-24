import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ModuleGraphCaller } from './graph/ModuleGraphCaller';
import { QuestEditor } from './QuestEditor';
import { createQueryRequest } from '../utils/requestHandler';
import { loadQuest, unloadQuest } from '../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RouteProp, useRoute } from '@react-navigation/core';
import { SvgDemo } from './graph/SvgAnimationDemo';

const Stack = createStackNavigator();

export const QuestEditorNavigator = () => {

  const route = useRoute<RouteProp<{ params: {
      questId: string
  }}, 'params'>>();

  const questDeep = useAppSelector((state) => state.editor.questDeep)
  const dispatch = useAppDispatch()

  useEffect(() => {
      if (!(questDeep && questDeep.quest.id === route.params.questId)) {
        dispatch(unloadQuest());
        createQueryRequest(route.params.questId)
          .then(q => q.json())
          .then(questDeep => dispatch(loadQuest(questDeep)))
          .catch(() => {console.log('Error parsing create/query endpoint (file QuestEditorNavigator.tsx)')});
      }
  }, [route.params.questId])

  return (
    <Stack.Navigator
      screenOptions={(route) => ({
        headerShown: true
      })}
    >
      <Stack.Screen name='QuestOverview' initialParams={{questId: '60a403afaf6922a6f2aa21e8'}}>
        {(props) => <QuestEditor/>}
      </Stack.Screen>
      <Stack.Screen name='ModuleGraph' component={ModuleGraphCaller}/>
      <Stack.Screen name='SvgDemo' component={SvgDemo}/>
    </Stack.Navigator>
  );
};