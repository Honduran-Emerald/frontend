import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { loadQuest, unloadQuest } from '../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createGetRequest } from '../utils/requestHandler';
import { QuestEditorNavigator } from './QuestEditorNavigator';
import { removeRecentlyVisitedQuest } from '../redux/quests/questsSlice';
import { storeData } from '../utils/AsyncStore';
import { QueriedQuest } from '../types/quest';
import { useNavigation } from '@react-navigation/native';

export const QuestEditorWrapper = () => {

  //const questPrototype = useAppSelector(store => store.editor.questPrototype)
  const quest = useAppSelector(state => state.editor);
  const recentQuests: QueriedQuest[] = useAppSelector((state) => state.quests.recentlyVisitedQuests)

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<{ params: {
    questId: string
  }}, 'params'>>();

  useEffect(() => {
    if (!quest.questPrototype || quest.questId !== route.params.questId) {
      dispatch(unloadQuest());
      createGetRequest(route.params.questId)
        .then(q => {
          if(q.status === 200) {
            q.json().then(questDeep => dispatch(loadQuest({
              questId: route.params.questId,
              questPrototype: questDeep.questPrototype
            })))
          } else {
            if(recentQuests.find((q) => q.id === route.params.questId)) {
              dispatch(removeRecentlyVisitedQuest(route.params.questId));
              const tmp = recentQuests.filter((q) => q.id !== route.params.questId);
              storeData('RecentlyVisitedQuests', JSON.stringify(tmp)).then(() => {}, () => {});
            }
            alert('Error while loading. Quest may have been deleted.');
            navigation.goBack();
          }
        })

    }
  }, [route.params.questId])

  return (
    <>{(quest.questPrototype && quest.questId === route.params.questId) && <QuestEditorNavigator />}</>
  )
}
