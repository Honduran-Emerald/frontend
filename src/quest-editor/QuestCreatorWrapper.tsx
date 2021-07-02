import React, { useEffect, useState } from 'react';
import { loadQuest, setImagePath } from '../redux/editor/editorSlice';
import { useAppDispatch } from '../redux/hooks';
import { createQuestRequest } from '../utils/requestHandler';
import { QuestEditorNavigator } from './QuestEditorNavigator';

interface QuestCreatorWrapperProps {
  route: {
    key: string,
    name: string,
    params: {
      screen: string,
      params: {
        latitude: number,
        longitude: number,
      },
    },
  },
}

export const QuestCreatorWrapper : React.FC<QuestCreatorWrapperProps> = ({ route }) => {

  const [questCreated, setQuestCreated] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // latitude, longitude
    createQuestRequest()
      .then(r => r.json())
      .then(r => dispatch(loadQuest({questId: r.questId, questPrototype: {
        id: r.questPrototype.id,
        title: '',
        description: '',
        tags: [],
        locationName: '',
        location: {
          latitude: route.params.params.latitude,
          longitude: route.params.params.longitude
        },
        imageReference: null,
        approximateTime: '',
        agentProfileReference: null,
        agentProfileName: '',
        firstModuleReference: 1,
        modules: [],
        images: []
      }}))).then(() => dispatch(setImagePath('')))
      .then(() => setQuestCreated(true))
  }, [])

  return (
    <>
      {questCreated && <QuestEditorNavigator />}
    </>
  )
}
