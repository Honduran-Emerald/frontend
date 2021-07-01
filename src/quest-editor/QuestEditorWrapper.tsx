import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { loadQuest, unloadQuest } from '../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createGetRequest } from '../utils/requestHandler';
import { QuestEditorNavigator } from './QuestEditorNavigator';

export const QuestEditorWrapper = () => {

  //const questPrototype = useAppSelector(store => store.editor.questPrototype)
  const quest = useAppSelector(state => state.editor)

  const dispatch = useAppDispatch();

  const route = useRoute<RouteProp<{ params: {
    questId: string
  }}, 'params'>>();

  useEffect(() => {
    if (!quest.questPrototype || quest.questId !== route.params.questId) {
      dispatch(unloadQuest());
      createGetRequest(route.params.questId)
        .then(q => q.json())
        .then(questDeep => dispatch(loadQuest({questId: route.params.questId, questPrototype: questDeep.questPrototype})))
      
    }
  }, [route.params.questId])  

  return (
    <>{(quest.questPrototype && quest.questId === route.params.questId) && <QuestEditorNavigator />}</>
  )
}