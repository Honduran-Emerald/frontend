import React, { useEffect, useState } from 'react';
import { loadQuest } from '../redux/editor/editorSlice';
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
        approximateTime: '',
        creationTime: '',
        description: '',
        firstModuleReference: 1,
        imageId: '',
        location: {
          latitude: route.params.params.latitude,
          longitude: route.params.params.longitude
        },
        locationName: '',
        modules: [],
        agentProfileImageId: '',
        agentProfileName: '',
        tags: [],
        title: ''
      }})))
      .then(() => setQuestCreated(true))
  }, [])

  return (
    <>
      {questCreated && <QuestEditorNavigator />}
    </>
  )
}
